var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars');

var targetsCollection = require('../../collections/common/targets.js');
    IndicatorsCollection = require('../../collections/common/indicators.js');

var status = require ('../../models/map/status.js');

var template = Handlebars.compile(require('../../templates/map/dashboard.hbs')),
    targetsTemplate = Handlebars.compile(require('../../templates/map/targets.hbs'));
    indicatorsTemplate = Handlebars.compile(require('../../templates/map/indicators.hbs'));

var DashboardView = Backbone.View.extend({

  id: 'dashboard-container',
  className: 'l-dashboard',

  events: {
    'click .js--toggle-dashboard': '_toggleDashboard',
    'click .js--toggle-target': '_toogleIndicators',
    'change .js--layer-selector': '_selectLayer',
  },

  initialize: function() {
    this.status = status;

    //We will keep in this array the slug of the target
    // which indicators has already been requested in order to avoid asking twice for the same info;
    this.requestedTargets = [];

    this.targetsCollection = targetsCollection;
    this.indicatorsCollection = new IndicatorsCollection();
  },

  show: function() {
    this.targetsCollection.getTargetsList().done(_.bind(function() {
      this._renderTargets();
    }, this));
  },

  _updateRouterParams: function() {
    Backbone.Events.trigger('router:update-params', this.status);
  },

  _toggleDashboard: function(e) {
    $('body').toggleClass('is-dashboard-close');
  },

  _toogleIndicators: function(e) {
    //1 - Check if the indicator has already been requested.
    //2 - if so, open target. If not, request indicators and open target.
    var $currentTarget = $(e.currentTarget);
    var currentTargetSlug = $currentTarget.data('slug');

    if ( _.includes(this.requestedTargets, currentTargetSlug) ) {
      $currentTarget.parents('.m-dashboard-target').toggleClass('is-open');
    } else {
      this.indicatorsCollection.getInidcatorsByTarget(currentTargetSlug).done(_.bind(function() {
        this._renderIndicators(currentTargetSlug);
        this.requestedTargets.push(currentTargetSlug);
        $currentTarget.parents('.m-dashboard-target').toggleClass('is-open');
      }, this))
    }
  },

  render: function() {
    this.$el.html(template());
    return this;
  },

  _renderTargets: function() {
    var targets = this.targetsCollection.toJSON();
    this.$('#targets-container').append(targetsTemplate({targets: targets}))
  },

  _renderIndicators: function(targetSlug) {
    var indicatorsGrupedByType = this.indicatorsCollection.groupByType();

    this.$('#' + targetSlug).find('.js--indicators').html(indicatorsTemplate(indicatorsGrupedByType))
  },

  _selectLayer: function(e) {
    var $currentTarget = $(e.currentTarget);
    var currentTargetSlug = $currentTarget.val();

    if ($currentTarget.hasClass('-target')) {
      this._setActiveLayer('target', currentTargetSlug);
    } else {
      this._setActiveLayer('indicator', currentTargetSlug);
    }
  },

  _setActiveLayer: function(type, layer) {
    this.status.set({layerType: type, layer: layer});
    this._updateRouterParams();
  }

});

module.exports = DashboardView;