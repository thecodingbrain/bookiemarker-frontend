var BACKEND_ENDPOINT = "http://localhost:7231/bookmarks";

var bookmarksCache = [];

// The bookmark model
function Bookmark(href, created, url, title, thumbnail, summary) {
    var self = this;
    self.created = created;
    self.href = href;
    self.url = url;
    self.summary = summary;
    self.title = title;
    self.thumbnail = thumbnail;
}

// The bookmark view model
function BookmarkViewModel() {
    var self = this;

    self.bookmarks = ko.observableArray(bookmarksCache);
    self.query = ko.observable(); 
    self.url = ko.observable();
    
    self.loadBookmarks = function() {
        $.ajax({
            url: BACKEND_ENDPOINT,
            type: "GET",
            data: {sort: "created,desc"},
            success: function(data){
                bookmarksCache = [];
                if (data._embedded){
                    var bookmarks = data._embedded.bookmarks;
                    var pollingRequired = false;
                    for (var i=0; i < bookmarks.length; i++){
                        var bookmark = bookmarks[i];
                        if (!bookmark.title){
                            pollingRequired = true;
                        }
                        bookmarksCache.push(new Bookmark(
                            bookmark._links.self.href,
                            bookmark.created,
                            bookmark.url,
                            bookmark.title,
                            bookmark.thumbnail,
                            bookmark.summary
                        ));
                    }
                    if (pollingRequired){
                        setTimeout(self.loadBookmarks, 5000);
                    }
                }
            }
        }).done(function(){
            self.search();
        });
    };
    
    self.addBookmark = function() {
        $.ajax({
            url: BACKEND_ENDPOINT,
            type: "POST",
            contentType: "application/json",
            data: ko.toJSON(self),
            success: function(data){
                self.query("");
                self.loadBookmarks();
            }
        });
    };

    self.deleteBookmark = function(bookmark){
        $.ajax({
            url: bookmark.href,
            type: "DELETE",
            success: function(data){
                self.loadBookmarks();
            }
        });
    };

    self.updateBookmark = function(bookmark) {
        $.ajax({
            url: bookmark.href,
            type: "PUT",
            contentType: "application/json",
            data: ko.toJSON(bookmark),
            success: function(data){
                self.loadBookmarks();
            }
        });
    };    
        
    self.search = function(){
        var searchResult = [];
        for(var i=0; i < bookmarksCache.length; i++){
            var bookmark = bookmarksCache[i];
            var query = new RegExp(self.query(), 'i');
            if (bookmark.url.search(query) > -1 || bookmark.title.search(query) > -1 || bookmark.summary.search(query) > -1){
                searchResult.push(bookmark)
            }
        }
        self.bookmarks(searchResult);
    };
    
    // Load initial data
    self.loadBookmarks();
}

// Activates knockout.js
ko.applyBindings(new BookmarkViewModel());