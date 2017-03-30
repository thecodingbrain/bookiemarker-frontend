var stored_bookmarks = [
    {
        url: "http://codingbrain.com",
        thumbnail: "cb.thumb.png",
        title: "CodingBrain School",
        summary: "Training for the busy developer"
    },
    {
        url: "http://news.ycombinator.com",
        thumbnail: "hn.thumb.gif",
        title: "Hacker News",
        summary: "Tech news"
    }
];

// The bookmark model
function Bookmark(url, title, thumbnail, summary) {
    var self = this;
    self.url = url;
    self.summary = summary;
    self.title = title;
    self.thumbnail = thumbnail;
}

// The bookmark view model
function BookmarkViewModel() {
    var self = this;

    self.bookmarks = ko.observableArray(stored_bookmarks);
    self.query = ko.observable(); 
    self.url = ko.observable();
    
    self.addBookmark = function() {
        var bookmark = new Bookmark(self.url(), 
            "a new title", "100x100.png", "summary");
        stored_bookmarks.push(bookmark);
        self.search();
    };

    self.deleteBookmark = function(bookmark){
        for(var i = 0; i < stored_bookmarks.length; i++){
            if (stored_bookmarks[i].url ==  bookmark.url){
                stored_bookmarks.splice(i, 1);
                self.search();
            }
        }        
    };
    
    self.search = function(){
        var searchResult = [];
        for(var i=0; i < stored_bookmarks.length; i++){
            var bookmark = stored_bookmarks[i];
            var query = new RegExp(self.query(), 'i');
            if (bookmark.url.search(query) > -1 || bookmark.title.search(query) > -1 || bookmark.summary.search(query) > -1){
                searchResult.push(bookmark)
            }
        }
        self.bookmarks(searchResult);
    };
}

// Activates knockout.js
ko.applyBindings(new BookmarkViewModel());