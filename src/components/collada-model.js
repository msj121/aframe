var registerComponent = require('../core/component').registerComponent;
var THREE = require('../lib/three');

module.exports.Component = registerComponent('collada-model', {
  schema: {type: 'asset'},

  init: function () {
    this.model = null;
    this.loader = new THREE.ColladaLoader();
    this.loader.options.convertUpAxis = true;
  },

  update: function () {
    var self = this;
    var el = this.el;
    var src = this.data;

    if (!src) { return; }

    this.remove();

    this.loader.load(src, function (colladaModel) {
      self.model = colladaModel.scene;
      self.model.traverse(function(child){
        if(typeof child.material !== "undefined"){
          child.material.alphaTest = 0.5;
        }
      });
      el.setObject3D('mesh', self.model);
      el.emit('model-loaded', {format: 'collada', model: self.model});
    });
  },

  remove: function () {
    if (!this.model) { return; }
    this.el.removeObject3D('mesh');
  }
});
