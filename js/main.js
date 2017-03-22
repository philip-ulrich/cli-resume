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
        return false;
    });
    return window.postData;
}
function getPosts() {
    $.get(ghost.url.api('posts', {limit: 'all'})).done(function (data){
        window.posts = data.posts;
    }).fail(function (err){
        return false;
    });
    return window.posts;
}
function getPost(postSlug) {
    $.get(ghost.url.api('posts/slug/' + postSlug, {limit: '1'})).done(function (data){
        window.post = data.posts[0];
    }).fail(function (err){
        return false;
    });
    return window.post;
}
function getTags() {
    $.get(ghost.url.api('tags', {limit: 'all'})).done(function (data){
        window.posts = data.posts;
    }).fail(function (err){
        return false;
    });
    return window.posts;
}
function getTag(tagSlug) {
    $.get(ghost.url.api('posts/slug/' + tagSlug, {limit: '1'})).done(function (data){
        window.post = data.posts[0];
    }).fail(function (err){
        return false;
    });
    return window.post;
}

///////////////
// Variables //
///////////////
var path     = '~';                         // Default Path
var termUser = 'guest';                     // Terminal User
var termOwner= 'exec';                      // Terminal Owner
var termGroup= 'nginx';                     // Terminal Group
var dirPerms = 'drwxr-xr-x.';               // Folder Permissions
var filePerms= '-rwxr--r--.';               // File Permissions
var termHost = termUser + '@exec.tech';     // Terminal Hostname
var dirColor = '[[b;#0225c7;]'
var termDir  = dirPerms + " " + termOwner + " " + termGroup + " {x} " + dirColor;
var termFile = filePerms + " " + termOwner + " " + termGroup + " {x} ";
var title    =    "+==================================================================================+\n" +
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
var fileStruc=  {
                    ".extras"   :   { "key" : "value" },
                    ".ssh"      :   { "key" : "value" },
                    "blog"      :   { "key" : "value" },
                    "license"   :     "file"
                }
var helpResp =  "Help Text";
var lsHome   =  dirColor + "blog]" + "   license";
var lsBlog   =  dirColor + "posts   tags]" + "   about";
var lsHomeA  =  dirColor + ".extras   .ssh   blog]" + "   license";
var lsBlogA  =  dirColor+ "posts   tags]" + "   about";
var lsHomeL  =  termDir + "blog]\n" +
                termFile + "license";
var lsBlogL  =  termDir + "posts]\n" +
                termDir + "tags]\n" +
                termFile + "about";
var lsHomeAL =  termDir + ".extras]\n" +
                termDir + ".ssh]\n" +
                termDir + "blog]\n" +
                termFile + "license";
var lsBlogAL =  termDir + "posts]\n" +
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
    ls: function(options) {
        if (typeof options === 'undefined') {
            if (path == '~') {
                this.echo(lsHome);
            } else if (path == 'blog') {
                this.echo(lsBlog);
            } else if (path == 'posts') {
                window.that = this;
                window.posts = getPosts();
                count = window.posts.length;
                $.each(window.posts, function(index, value) {
                    window.that.echo(value.slug + '   ');
                });
            } else {
                this.echo('');
            }
        } else if (options == '-a') {
            if (path == '~') {
                this.echo(lsHomeA);
            }
            if (path == 'blog') {
                this.echo(lsBlogA);
            }
            if (path == 'posts') {
                window.that = this;
                window.posts = getPosts();
                count = window.posts.length;
                $.each(window.posts, function(index, value) {
                    window.that.echo(value.slug + '   ');
                });
            }
        } else if (options == '-l') {
            if (path == '~') {
                this.echo(format(lsHomeL,[latestPost().updated_at.substring(0,10),'2017-03-17']));
            }
            if (path == 'blog') {
                this.echo(format(lsBlogL,[latestPost().updated_at.substring(0,10),'2017-03-17','2017-03-17']));
            }
            if (path == 'posts') {
                window.that = this;
                window.posts = getPosts();
                count = window.posts.length;
                $.each(window.posts, function(index, value) {
                    window.that.echo(format(termFile,[value.updated_at.substring(0,10)]) + value.slug);
                });
            }
        } else if (options == '-al' || options == '-la') {
            if (path == '~') {
                this.echo(format(lsHomeAL,['2017-03-20','2017-03-20',latestPost().updated_at.substring(0,10),'2017-03-17']));
            }
            if (path == 'blog') {
                this.echo(format(lsBlogAL,[latestPost().updated_at.substring(0,10),'2017-03-17','2017-03-17']));
            }
            if (path == 'posts') {
                window.that = this;
                window.posts = getPosts();
                count = window.posts.length;
                $.each(window.posts, function(index, value) {
                    window.that.echo(format(termFile,[value.updated_at.substring(0,10)]) + value.slug);
                });
            }
        }
    },
    // cd case
    cd: function(folder) {
        if (typeof folder !== 'undefined') {
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
        } else {
            this.echo("this shall be an error"); // TODO
        }
    },
     // cat case
    cat: function(file) {
        if (typeof file !== 'undefined') {
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
                post = getPost(file);
                if (post == false) {
                    this.echo("post not found");
                } else {
                    this.clear();
                    this.pause();
                    this.echo(post.html,{raw:true});
                    setTimeout(function() {
                        window.scrollTo(0,0);
                    }, (100));
                }
            } else {
                // This could be the way cat actually works..
                // but lets just display an error for now
                this.echo("this shall be an error"); // TODO
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
        onBlur: function() {
            return false;
        }
    });
});
