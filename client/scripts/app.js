var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    // Saving initial state of like property
    var startingLike = this.get('like');

    // Setting like property to opposite of initial state
    this.set({like: !startingLike});
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    // For any attribute change on a Movie instance, initiate new sort
    this.on('change', this.sort);
  },

  comparator: 'title',

  sortByField: function(field) {
    // Reset the comparator to be field passed-in
    this.comparator = field;

    // Sort the collection now that the comparator's been reset
    this.sort();
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    // var viewThis = this;
    // this.model.on('change', viewThis.render.bind(viewThis));

    // Callback function needs to be passed context explicitly.
    // You can do this like in lines 70-71 or passing 'this' as context to .on()
    this.model.on('change', this.render, this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    this.model.toggleLike();
    this.render();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    // var moviesViewThis = this;
    // this.collection.on('sort', moviesViewThis.render.bind(moviesViewThis));

    // Callback function needs to be passed context explicitly.
    // You can do this like in lines 94-95 or passing 'this' as context to .on()
    this.collection.on('sort', this.render, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
