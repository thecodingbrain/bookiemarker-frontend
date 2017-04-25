var BACKEND_ENDPOINT = "http://localhost:7231/bookmarks";

var bookmarksCache = [];

// The bookmark model
function Bookmark(href, url, title, thumbnail, summary) {
    var self = this;
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
            success: function(data){
                bookmarksCache = [];
                if (data._embedded){
                    var bookmarks = data._embedded.bookmarks;
                    for (var i=0; i < bookmarks.length; i++){
                        var bookmark = bookmarks[i];
                        bookmarksCache.push(new Bookmark(
                            bookmark._links.self.href,
                            bookmark.url,
                            bookmark.title,
                            bookmark.thumbnail,
                            bookmark.summary
                        ));
                        
                    }
                }
            }
        }).done(function(){
            self.search();
        });
    };
    
    self.addBookmark = function() {
        var bookmark = new Bookmark(self.url(), 
            "a new title", "100x100.png", "summary");
        bookmarksCache.push(bookmark);
        self.search();
    };

    self.deleteBookmark = function(bookmark){
        for(var i = 0; i < bookmarksCache.length; i++){
            if (bookmarksCache[i].url ==  bookmark.url){
                bookmarksCache.splice(i, 1);
                self.search();
            }
        }        
    };

    self.updateBookmark = function(bookmark) {
        //alert('saved new summary: ' + bookmark.summary);
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