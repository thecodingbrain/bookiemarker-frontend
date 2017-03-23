var stored_bookmarks = [
    {
        url: "http://codingbrain.com",
        thumbnail: "100x100.png",
        title: "CodingBrain School",
        summary: "Training for the busy developer"
    },
    {
        url: "http://news.ycombinator.com",
        thumbnail: "100x100.png",
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
    self.url = ko.observable();
    self.query = ko.observable();

    self.addBookmark = function() {
        var bookmark = new Bookmark(self.url(), "a new title", "100x100.png", "summary");
        self.bookmarks.push(bookmark);
        stored_bookmarks.push(bookmark);
    };

    self.deleteBookmark = function() {
        stored_bookmarks.splice(indexOf(this), 1);
        self.search();
    };

    self.saveSummary = function() {
        // alert('saved new summary: ' + this.summary);
    };

    self.search = function(){
        var searchResult = [];
        for(var i = 0; i < stored_bookmarks.length; i++){
            var bookmark = stored_bookmarks[i];
            var query = new RegExp(self.query(), 'i');
            if (bookmark.url.search(query) > -1 || bookmark.title.search(query) > -1 || bookmark.summary.search(query) > -1){
                searchResult.push(bookmark)
            }
        }
        self.bookmarks(searchResult);
    };

    var indexOf = function(bookmark){
        var index = -1;
        for(var i = 0; i < stored_bookmarks.length; i++){
            if (stored_bookmarks[i].url == bookmark.url){
                index = i;
                break;
            }
        }
        return index;
    };
}

// Activates knockout.js
ko.applyBindings(new BookmarkViewModel());