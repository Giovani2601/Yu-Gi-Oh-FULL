const sanitizeHtml = require('sanitize-html');

function sanitizeBody(req, res, next) {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],      // Remove tags HTML
          allowedAttributes: {} // Remove todos os atributos
        });
      }
    }
  }
  next();
}

module.exports = sanitizeBody;
