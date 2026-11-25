const { auth } = require('../firebase');

const requireAdmin = async (req, res, next) => {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ success: false, message: 'Debes iniciar sesión para realizar esta operación' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(match[1]);
    const allowedUids = (process.env.ADMIN_UIDS || '')
      .split(',')
      .map(uid => uid.trim())
      .filter(Boolean);
    const allowedEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(email => email.trim().toLocaleLowerCase())
      .filter(Boolean);

    if (!allowedUids.length && !allowedEmails.length) {
      return res.status(503).json({
        success: false,
        message: 'El acceso administrativo todavía no está configurado'
      });
    }

    if (!allowedUids.includes(decodedToken.uid) &&
        (!decodedToken.email || !allowedEmails.includes(decodedToken.email.toLocaleLowerCase()))) {
      return res.status(403).json({ success: false, message: 'Tu cuenta no tiene permisos de administración' });
    }

    req.admin = { uid: decodedToken.uid, email: decodedToken.email || null };
    return next();
  } catch (error) {
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error' || error.code === 'auth/invalid-id-token') {
      return res.status(401).json({ success: false, message: 'La sesión no es válida o expiró. Inicia sesión de nuevo.' });
    }
    return next(error);
  }
};

module.exports = requireAdmin;
