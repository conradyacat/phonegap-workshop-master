var app = {

    initialize: function() {
        var self = this;
        this.detailsURL = /^#employees\/(\d{1,})/;
        this.registerEvents();
        this.store = new MemoryStore(function() {
          self.route();
        });
    },

    showAlert: function(message, title) {
      if (navigator.notification) {
        navigator.notification.alert(message, null, title, 'OK');
      } else {
        alert(title ? (title + ': ' + message) : message);
      }
    },

    registerEvents: function() {
      var self = this;
      if (document.documentElement.hasOwnProperty('ontouchstart')) {
        $('body').on('touchstart', 'a', function(event) {
          $(event.target).addClass('tappable-active');
        });
        $('body').on('touchend', 'a', function(event) {
          $(event.target).removeClass('tappable-active');
        });
      } else {
        $('body').on('mousedown', 'a', function(event) {
          $(event.target).addClass('tappable-active');
        });
        $('body').on('mouseup', 'a', function(event) {
          $(event.target).removeClass('tappable-active');
        });
      }

      $(window).on('hashchange', $.proxy(this.route, this));
    },

    route: function() {
      var hash = window.location.hash;
      if (!hash) {
        if (this.homePage) {
          this.slidePage(this.homePage);
        } else {
          this.homePage = new HomeView(this.store).render();
          this.slidePage(this.homePage);
        }
        return;
      }

      var match = hash.match(app.detailsURL);
      if (match) {
        this.store.findById(Number(match[1]), function(employee) {
          $('body').html(new EmployeeView(employee).render().el);
        });
      }
    },

    slidePage: function(page) {
      var currentPageDest;
      self = this;

      if (!this.currentPage) {
        $(page.el).attr('class', 'page stage-center');
        $('body').append(page.el);
        this.currentPage = page;
        return;
      }

      $('.stage-right, .stage-left').not('.homePage').remove();

      if (page === app.homePage) {
        $(page.el).attr('class', 'page stage-left');
        currentPageDest = 'stage-right';
      } else {
        $(page.el).attr('class', 'page stage-right');
        currentPageDest = 'stage-left';
      }

      $('body').append(page.el);

      setTimeout(function() {
        $(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
        $(page.el).attr('class', 'page stage-center transition');
        self.currentPage = page;
      });
    }

};

app.initialize();
