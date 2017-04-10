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

    self.bookmarks = ko.observableArray();
    self.query = ko.observable(); 
    self.url = ko.observable();
    
    self.addBookmark = function() {
       // make POST request
        $.ajax({
            url: BACKEND_ENDPOINT,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ url: self.url()}),
            dataType: "json",
            success: function(data) {
                self.query("");
                self.loadBookmarks();
            }
        });
    };

    // delete bookmark: send DELETE to bookmarks resource
    self.deleteBookmark = function (bookmark) {
        $.ajax({
            url: bookmark.href,
            type: "delete",
            success: function (allData) {
                self.loadBookmarks();
            }
        });
    };
    
    // update bookmark: send PUT to existing bookmarks resource
    self.updateBookmark = function (bookmark) {
        // make PATCH request to change the summary
        $.ajax({
            url: bookmark.href,
            data: JSON.stringify({ summary: bookmark.summary }),
            type: "PATCH",
            contentType: "application/json",
            success: function (allData) {
                self.loadBookmarks();
            }
        });
    };
        
    self.search = function(){
        var searchResult = [];
        for(var i=0; i < bookmarksCache.length; i++){
            var bookmark = bookmarksCache[i];
            var query = new RegExp(self.query(), 'i');
            if (
                bookmark.url.search(query) > -1 || bookmark.title.search(query) > -1 || bookmark.summary.search(query) > -1){
                    searchResult.push(bookmark)
            }
        }
        self.bookmarks(searchResult);
    };
    
    // load bookmarks from server: GET on bookmarks resource
    self.loadBookmarks = function () {
        $.ajax({
            url: BACKEND_ENDPOINT,
            data: {sort: "created"},
            type: "GET",
            success: function (allData) {
                bookmarksCache = [];
                var json = ko.toJSON(allData);
                var parsed = JSON.parse(json);
                if (parsed._embedded) {
                    var parsedBookmarks = parsed._embedded.bookmarks;
                    var pollingRequired = false;
                    for (var i=0; i < parsedBookmarks.length; i++){
                        var bookmark = parsedBookmarks[i];
                        if (!bookmark.title){
                            pollingRequired = true;
                        }
                        bookmarksCache.push(new Bookmark(
                            bookmark._links.self.href,  
                            bookmark.url, 
                            bookmark.title, 
                            bookmark.thumbnail, 
                            bookmark.summary));
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
    
    // Load initial data
    self.loadBookmarks();  
}

// Activates knockout.js
ko.applyBindings(new BookmarkViewModel());