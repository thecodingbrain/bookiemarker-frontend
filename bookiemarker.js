var BACKEND_ENDPOINT = "http://localhost:7231/bookmarks"; 

self.stored_bookmarks = [];

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
        $.ajax(BACKEND_ENDPOINT, {
            data: {"url": self.url()},
            type: "post",
            contentType: "application/json",
            success: function (bookmark) {
                self.loadBookmarks();
                self.bookmarks().push(bookmark);
            }
        });
    };

    // delete bookmark: send DELETE to bookmarks resource
    self.deleteBookmark = function (bookmark) {
        $.ajax(bookmark.href, {
            type: "delete",
            success: function (allData) {
                self.loadBookmarks();
                self.search();
            }
        });
    };
    
    // update bookmark: send PUT to existing bookmarks resource
    self.updateBookmark = function (bookmark) {
        // make PUT request (or send PATCH then we don't need to include the created date)
        $.ajax(bookmark.href, {
            data: { "summary": bookmark.summary }
            type: "patch",
            contentType: "application/json",
            success: function (allData) {
                self.loadBookmarks();
            }
        });
    };
        
    self.search = function(){
        var searchResult = [];
        for(var i=0; i < stored_bookmarks.length; i++){
            var bookmark = stored_bookmarks[i];
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
        $.ajax(BACKEND_ENDPOINT, {
            type: "get",
            success: function (allData) {
                var json = ko.toJSON(allData);
                var parsed = JSON.parse(json);
                if (parsed._embedded) {
                    var parsedBookmarks = parsed._embedded.bookmarks;
                    stored_bookmarks = 
                        $.map(parsedBookmarks, 
                            function (bookmark) {
                                return new Bookmark(
                                    bookmark._links.self.href,  
                                    bookmark.url, 
                                    bookmark.title, 
                                    bookmark.thumbnail, bookmark.summary)
                        });
                } else {
                    stored_bookmarks = [];
                }

            }
        });
    };    
    
    // Load initial data
    self.loadBookmarks();  
    self.bookmarks(stored_bookmarks);  
}

// Activates knockout.js
ko.applyBindings(new BookmarkViewModel());