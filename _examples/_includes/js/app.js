(function(context) {
  var Docs = function() {};

  Docs.prototype = {

    queryExamples: function () {
      var search = $('#search');
      var tExamples = _.template($('#examples').html());
      var tags = [], data;

      var fullResult = $.ajax({
        url: 'search.json',
        dataType: 'json',
        success: function(r) {
          data = _(r).chain()
            .compact()
            .map(function(r) {
              r.words = (r.title.toLowerCase() + ' ' + (r.tags.toString()).toLowerCase()).match(/(\w+)/g);
              return r;
            })
            .value();
          _.delay(function () {tagList(tags)}, 10);
          _.each(data, function(result){
            $('#results').append(tExamples(result));
            tags.push(result.tags);
          });
        }
      });

      var tagList = function (tags) {
        var tTags = _.template($('#tags').html());

          var f = _.flatten(tags);
          var u = _.uniq(f);

        _.each(u, function(tag) {
          $('#tag-list').append(tTags({'tag': tag}));
        });

        _.delay(function () {
          $('#tag-list').find('a').on('click', tagFilter);
        }, 1);

        var tagFilter = function(e) {
          e.preventDefault();
          $('#results').empty();
          var tag = $(this).attr('data-tag');

          if (!$(this).hasClass('active')) {
            $('#tag-list').find('a').removeClass('active');
            $(this).addClass('active');

            var filtered = find(tag.toLowerCase().match(/(\w+)/g));
            _(filtered).each(function(p) {
              $('#results').append(tExamples(p));
            });
          } else {
            $(this).removeClass('active');
              _.each(data, function(result){
                $('#results').append(tExamples(result));
              });
          }
        }
      }

      var find = function(phrase) {
        var matches = _(data).filter(function(p) {
          return _(phrase).filter(function(a) {
            return _(p.words).any(function(b) {
              return a === b || b.indexOf(a) === 0;
            });
          }).length === phrase.length;
        });

        return matches;
      };

      $('input', search).keyup(_(function() {
        $('#results').empty();
        var phrase = $('input', search).val();

        if (phrase.length >= 2) {
          var matches = find(phrase.toLowerCase().match(/(\w+)/g));
          $('#tag-list').find('a').removeClass('active');
          _(matches).each(function(p) {
            $('#results').append(tExamples(p));
          });
          if (matches.length) return;
        } else {
          _.each(data, function(result){
            $('#results').append(tExamples(result));
          });
        }

        return false;
      }).debounce(100));
    },

    getGist: function(hash) {
      var that = this;
      var request = 'https://api.github.com/gists/' + hash;

      // Code Snippets
      var markdownSnippets = _.template($('#markdown-snippets').html());
      var htmlSnippets = _.template($('#html-snippets').html());
      var tSnippets = _.template($('#snippets').html());

      // Table of Contents
      var markdownToc = _.template($('#markdown-listing').html());
      var htmlToc = _.template($('#html-listing').html());
      var restToc = _.template($('#rest-listing').html());

      $.getJSON(request + '?callback=?', function(resp) {
          _.each(resp.data.files, function(files) {
            var s = files.filename.split('.');
            var ext = s[1];

            // Create an ID name for anchor linking in the navigation
            files.id = s[0];

            if (files.language === 'HTML') {
              $('#html').append(htmlSnippets(files));
              $('#html-toc').append(htmlToc(files));
            } else if (files.language === 'Markdown') {
              $('#markdown').append(markdownSnippets(files));
              $('#markdown-toc').append(markdownToc(files));
            } else {
              $('#code-examples').append(tSnippets(files));
              $('#rest-toc').append(restToc(files));
            }
          });
          // Syntax Highlighting
          prettyPrint();

          // Markdown to html using showdown
          var toHtml = (new Showdown.converter()).makeHtml($('#markdown').text());
          $('#markdown').html(toHtml);

          // Animate scrolling down the document when toc links are clicked.
          $('#toc').find('a').on('click', that.animateScrolling);
      });
    },

    isTouchDevice: function() {
      return 'ontouchstart' in window;             
    },

    animateScrolling: function(e) {
      e.preventDefault();
      if ($(this).hasClass('top')) {
        // Scroll to just below the preview map
        $('html, body').animate({scrollTop: 575}, 300);
      } else {
        var a = $(e.target).attr('href');
        $('body,html').animate({ scrollTop: $(a).offset().top }, 500);
      }
    },

    fixedSidebar: function() {
      var nav = $('.sidebar-inner');
      var that = this;

      if (!nav || !nav.length) return;
      var top = nav.offset().top - parseFloat(nav.css('marginTop').replace(/auto/, 0));
      $(window).scroll(function (e) {
        if (!that.isTouchDevice()) {
          var y = $(this).scrollTop();
          if (y >= top) {
            nav.addClass('fixed');
          } else {
            nav.removeClass('fixed');
          }
        }
      });    
    }
  };

window.Docs = Docs;
})(window);
