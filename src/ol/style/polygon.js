goog.provide('ol.style.Polygon');
goog.provide('ol.style.PolygonLiteral');

goog.require('goog.asserts');
goog.require('ol.expression');
goog.require('ol.expression.Expression');
goog.require('ol.expression.Literal');
goog.require('ol.style.Symbolizer');
goog.require('ol.style.SymbolizerLiteral');


/**
 * @typedef {{fillColor: (string|undefined),
 *            strokeColor: (string|undefined),
 *            strokeWidth: (number|undefined),
 *            opacity: (number)}}
 */
ol.style.PolygonLiteralOptions;



/**
 * @constructor
 * @extends {ol.style.SymbolizerLiteral}
 * @param {ol.style.PolygonLiteralOptions} options Polygon literal options.
 */
ol.style.PolygonLiteral = function(options) {
  goog.base(this);

  /** @type {string|undefined} */
  this.fillColor = options.fillColor;
  if (goog.isDef(options.fillColor)) {
    goog.asserts.assertString(options.fillColor, 'fillColor must be a string');
  }

  /** @type {string|undefined} */
  this.strokeColor = options.strokeColor;
  if (goog.isDef(this.strokeColor)) {
    goog.asserts.assertString(
        this.strokeColor, 'strokeColor must be a string');
  }

  /** @type {number|undefined} */
  this.strokeWidth = options.strokeWidth;
  if (goog.isDef(this.strokeWidth)) {
    goog.asserts.assertNumber(
        this.strokeWidth, 'strokeWidth must be a number');
  }

  goog.asserts.assert(
      goog.isDef(this.fillColor) ||
      (goog.isDef(this.strokeColor) && goog.isDef(this.strokeWidth)),
      'Either fillColor or strokeColor and strokeWidth must be set');

  goog.asserts.assertNumber(options.opacity, 'opacity must be a number');
  /** @type {number} */
  this.opacity = options.opacity;

};
goog.inherits(ol.style.PolygonLiteral, ol.style.SymbolizerLiteral);


/**
 * @inheritDoc
 */
ol.style.PolygonLiteral.prototype.equals = function(polygonLiteral) {
  return this.fillColor == polygonLiteral.fillColor &&
      this.strokeColor == polygonLiteral.strokeColor &&
      this.strokeWidth == polygonLiteral.strokeWidth &&
      this.opacity == polygonLiteral.opacity;
};



/**
 * @constructor
 * @extends {ol.style.Symbolizer}
 * @param {ol.style.PolygonOptions} options Polygon options.
 */
ol.style.Polygon = function(options) {
  goog.base(this);

  /**
   * @type {ol.expression.Expression}
   * @private
   */
  this.fillColor_ = !goog.isDefAndNotNull(options.fillColor) ?
      null :
      (options.fillColor instanceof ol.expression.Expression) ?
          options.fillColor : new ol.expression.Literal(options.fillColor);

  // stroke handling - if any stroke property is supplied, use defaults
  var strokeColor = null,
      strokeWidth = null;

  if (goog.isDefAndNotNull(options.strokeColor) ||
      goog.isDefAndNotNull(options.strokeWidth)) {

    if (goog.isDefAndNotNull(options.strokeColor)) {
      strokeColor = (options.strokeColor instanceof ol.expression.Expression) ?
          options.strokeColor :
          new ol.expression.Literal(options.strokeColor);
    } else {
      strokeColor = new ol.expression.Literal(
          /** @type {string} */ (ol.style.PolygonDefaults.strokeColor));
    }

    if (goog.isDefAndNotNull(options.strokeWidth)) {
      strokeWidth = (options.strokeWidth instanceof ol.expression.Expression) ?
          options.strokeWidth :
          new ol.expression.Literal(options.strokeWidth);
    } else {
      strokeWidth = new ol.expression.Literal(
          /** @type {number} */ (ol.style.PolygonDefaults.strokeWidth));
    }
  }

  /**
   * @type {ol.expression.Expression}
   * @private
   */
  this.strokeColor_ = strokeColor;

  /**
   * @type {ol.expression.Expression}
   * @private
   */
  this.strokeWidth_ = strokeWidth;

  // one of stroke or fill can be null, both null is user error
  goog.asserts.assert(!goog.isNull(this.fillColor_) ||
      !(goog.isNull(this.strokeColor_) && goog.isNull(this.strokeWidth_)),
      'Stroke or fill properties must be provided');

  /**
   * @type {ol.expression.Expression}
   * @private
   */
  this.opacity_ = !goog.isDef(options.opacity) ?
      new ol.expression.Literal(ol.style.PolygonDefaults.opacity) :
      (options.opacity instanceof ol.expression.Expression) ?
          options.opacity : new ol.expression.Literal(options.opacity);

};
goog.inherits(ol.style.Polygon, ol.style.Symbolizer);


/**
 * @inheritDoc
 * @return {ol.style.PolygonLiteral} Literal shape symbolizer.
 */
ol.style.Polygon.prototype.createLiteral = function(opt_feature) {

  var fillColor;
  if (!goog.isNull(this.fillColor_)) {
    fillColor = ol.expression.evaluateFeature(this.fillColor_, opt_feature);
    goog.asserts.assertString(fillColor, 'fillColor must be a string');
  }

  var strokeColor;
  if (!goog.isNull(this.strokeColor_)) {
    strokeColor = ol.expression.evaluateFeature(this.strokeColor_, opt_feature);
    goog.asserts.assertString(strokeColor, 'strokeColor must be a string');
  }

  var strokeWidth;
  if (!goog.isNull(this.strokeWidth_)) {
    strokeWidth = ol.expression.evaluateFeature(this.strokeWidth_, opt_feature);
    goog.asserts.assertNumber(strokeWidth, 'strokeWidth must be a number');
  }

  goog.asserts.assert(
      goog.isDef(fillColor) ||
      (goog.isDef(strokeColor) && goog.isDef(strokeWidth)),
      'either fillColor or strokeColor and strokeWidth must be defined');

  var opacity = ol.expression.evaluateFeature(this.opacity_, opt_feature);
  goog.asserts.assertNumber(opacity, 'opacity must be a number');

  return new ol.style.PolygonLiteral({
    fillColor: fillColor,
    strokeColor: strokeColor,
    strokeWidth: strokeWidth,
    opacity: opacity
  });
};


/**
 * @type {ol.style.PolygonLiteral}
 */
ol.style.PolygonDefaults = new ol.style.PolygonLiteral({
  fillColor: '#ffffff',
  strokeColor: '#696969',
  strokeWidth: 1.5,
  opacity: 0.75
});
