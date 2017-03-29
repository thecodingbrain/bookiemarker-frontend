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

    self.bookmarks = null;
    self.query = null; 
    self.search = function(){
    };
}

// Activates knockout.js
ko.applyBindings(new BookmarkViewModel());