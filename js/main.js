///////////////
// Functions //
///////////////
function format(source, params) {
    $.each(params,function (i, n) {
        source = source.replace("{x}", n);
    })
    return source;
}
function titleText(text) {
    return "[[g;#0225c7;]" + text + "]";    // Glowing Blue Text
}
function subText(text) {
    return "[[g;#00c5c7;]" + text + "]";    // Glowing Cyan Text
}
function errText(text) {
    return "[[;#f00;]" + text + "]";        // Red Text
}
function blankLine(num) {
    return "\n".repeat(num);
}
function latestPost() {
    $.get(ghost.url.api('posts', {limit: 1})).done(function (data){
        window.postData = data.posts[0];
    }).fail(function (err){
        console.log(err);
    });
    return window.postData;
}
function getPosts() {
    $.get(ghost.url.api('posts', {limit: 'all'})).done(function (data){
        window.posts = data.posts;
    }).fail(function (err){
        console.log(err);
    });
    return window.posts;
}
function getPost(postID) {
    $.get(ghost.url.api('posts/' + postID, {limit: '1'})).done(function (data){
        window.post = data.posts[0];
    }).fail(function (err){
        console.log(err);
    });
    return window.post;
}

///////////////
// Variables //
///////////////
var path = '~';                             // Default Path
var termUser = 'guest';                     // Terminal User
var termOwner = 'exec';
var termGroup = 'nginx';
//var pausePost = false;
var termHost = termUser + '@exec.tech';     // Terminal Hostname
var termDir  = "drwxr-xr-x. " + termOwner + " " + termGroup + " {x} [[b;#0225c7;]";
var termFile = "-rwxr--r--. " + termOwner + " " + termGroup + " {x} ";
var title =     "+==================================================================================+\n" +
                "|  _______  ___   ___  _______   ______    __________  _______   ______  __    __  |\n" +
                "| |   ____| \\  \\ /  / |   ____| /      |  |          ||   ____| /      ||  |  |  | |\n" +
                "| |  |__     \\  V  /  |  |__   |  ,----'  `---|  |---`|  |__   |  ,----'|  |__|  | |\n" +
                "| |   __|     >   <   |   __|  |  |           |  |    |   __|  |  |     |   __   | |\n" +
                "| |  |____   /  .  \\  |  |____ |  `----.  __  |  |    |  |____ |  `----.|  |  |  | |\n" +
                "| |_______| /__/ \\__\\ |_______| \\______| (__) |__|    |_______| \\______||__|  |__| |\n" +
                "|                                                                                  |\n" +
                "+==================================================================================+\n";
var subtitle =  "   ==============================================================================\n" +
                " //                                                                              \\\\ \n" +
                "||                          a nerdy blog by a nerdy guy                           ||\n" +
                "||                                                                                ||\n" +
                "||                                                                                ||\n" +
                "||     not feeling a terminal? there is a gui as well: ][[!;;]https://exec.tech/gui][[g;#00c5c7;]      ||\n" +
                "||                                                                                ||\n" +
                "||    type 'help' to get a list of commands or begin navigating by typing 'ls'    ||\n" +
                " \\\\                                                                              //\n" +
                "   ==============================================================================\n";
var helpResp =  "Help Text";
var lsHome   =  termDir + "blog]\n" +
                termFile + "license";
var lsBlog   =  termDir + "posts]\n" +
                termDir + "tags]\n" +
                termFile + "about";

/////////////
// Program //
/////////////
jQuery.ajaxSetup({async:false}); // we don't actually need async... it's okay, I promise
var processor = {
    // help case
    help: function() {
        this.echo(helpResp);
    },
    // echo case
    echo: function(text) {
        this.echo(text);
    },
    // ls case
    ls: function() {
        if (path == '~') {
            this.echo(format(lsHome,[latestPost().updated_at.substring(0,10),"2017-03-17"]));
        }
        if (path == 'blog') {
            this.echo(format(lsBlog,[latestPost().updated_at.substring(0,10),"2017-03-17","2017-03-17"]));
        }
        if (path == 'posts') {
            window.that = this;
            window.posts = getPosts();
            count = window.posts.length;
            $.each(window.posts, function(index, value) {
                window.that.echo(format(termFile,[value.updated_at.substring(0,10)]) + value.slug);
            });
        }
    },
    // cd case
    cd: function(folder) {
        if (path == '~') {
            if (folder == 'blog') {
                path = 'blog';
            } else {
                this.echo(errText("-bash: cd: '" + folder + "': No such file or directory"));
            }
        }
        else if (path == 'blog') {
            if (folder == 'posts') {
                path = 'posts';
            } else {
                this.echo(errText("-bash: cd: '" + folder + "': No such file or directory"));
            }
        }
    },
     // cat case
    cat: function(file) {
        /*if (path == '~') {
            if (folder == 'blog') {
                path = 'blog';
            } else {
                this.echo(errText("-bash: cd: '" + folder + "': No such file or directory"));
            }
        }
        if (path == 'blog') {
            if (folder == 'posts') {
                path = 'posts';
            } else {
                this.echo(errText("-bash: cd: '" + folder + "': No such file or directory"));
            }
        }*/
        if (path == 'posts') {
            if (typeof window.posts === 'undefined') {
                window.posts = getPosts();
                console.log("pulling posts");
            }
            catFound = false;
            $.each(window.posts, function(index, value) {
                if (value.slug == file) {
                    catFound = value.id;
                }
            });
            if (catFound == false) {
                this.echo("post not found");
            } else {
                //pausePost = true;
                this.clear();
                this.pause();
                this.echo(getPost(catFound).html,{raw:true});
                setTimeout(function() {
                    window.scrollTo(0,0);
                }, (100));
            }
        }
    },
    // resume case
    resume: function(text) {
        term.echo('You will now be directed to my resume. Please wait...')
        setTimeout(function() {
            window.location = "https://resume.exec.tech";
        }, (3 * 1000));
    }
}
jQuery(document).ready(function($) {
    keyboardeventKeyPolyfill.polyfill();
    var id = 1;
    $('body').terminal(processor,
    {
        prompt: function(r){
            r(termHost + " " + path + "# ");
        },
        greetings:  titleText(title) +
                    blankLine(2) +
                    subText(subtitle) +
                    blankLine(2),
        completion: true,
        checkArity: false,
        convertLinks: false,
        /*keydown: function(e, term) {
            if (pausePost) {
                if (e.which == 68 && e.ctrlKey) { // CTRL+D
                    //this.clear();
                    this.resume();
                    //pausePost = false;
                }
                return false;
            }
        },*/
        onBlur: function() {
            return false;
        }
    });
});
