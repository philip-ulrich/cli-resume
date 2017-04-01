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
    return $.get(ghost.url.api('posts', {limit: 1})).done(function (data){
        return data.posts;
    }).fail(function (err){
        return false;
    });
}
function getPosts() {
    return $.get(ghost.url.api('posts', {limit: 'all'})).success(function (data){
        return data.posts;
    }).fail(function (err){
        return false;
    });
}
function getPost(postSlug) {
    return $.get(ghost.url.api('posts/slug/' + postSlug, {limit: '1'})).success(function (data){
        return data.posts;
    }).fail(function (err){
        return false;
    });
}
function getTags() {
    return $.get(ghost.url.api('tags', {limit: 'all'})).success(function (data){
        return data.tags;
    }).fail(function (err){
        return false;
    });
}
function getTag(tagSlug) {
    return $.get(ghost.url.api('posts/slug/' + tagSlug, {limit: '1'})).success(function (data){
        return data.tags;
    }).fail(function (err){
        return false;
    });
}
function isDefined(variable) {
    if (typeof variable !== 'undefined') {
        return '| ' + variable;
    } else {
        return " ";
    }
}
// JSON Searching Functions courtesy of:
// https://gist.github.com/iwek/3924925/
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}
function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}
function getKeys(obj, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] == val) {
            objects.push(i);
        }
    }
    return objects;
}

/////////////////
// File System //
/////////////////
latestPost().success(function (data) {
    window.latestPostDate = data['posts'][0]['updated_at'].substring(0,10);
    window.fileStructure =
    [
        {
            "name": "~",
            "date": "2017-03-24",
            "type": "folder",
            "prnt": "~",
            "children":   [
                            {
                                "name": ".extras",
                                "date": "2017-03-24",
                                "type": "folder",
                                "prnt": "~",
                                "children":   [
                                                {
                                                    "name": "example-file1",
                                                    "date": "2017-03-24",
                                                    "type": "file",
                                                    "prnt": ".extras"
                                                },
                                                {
                                                    "name": "example-file2",
                                                    "date": "2017-03-24",
                                                    "type": "file",
                                                    "prnt": ".extras"
                                                }
                                            ]
                            },
                            {
                                "name": ".ssh",
                                "date": "2017-03-24",
                                "type": "folder",
                                "prnt": "~",
                                "children":   [
                                                {
                                                    "name": "example-file3",
                                                    "date": "2017-03-24",
                                                    "type": "file",
                                                    "prnt": ".ssh"
                                                },
                                                {
                                                    "name": "example-file4",
                                                    "date": "2017-03-24",
                                                    "type": "file",
                                                    "prnt": ".ssh"
                                                }
                                            ]
                            },
                            {
                                "name": "blog",
                                "date": window.latestPostDate,
                                "type": "folder",
                                "prnt": "~",
                                "children":   [
                                                {
                                                    "name": "posts",
                                                    "date": window.latestPostDate,
                                                    "type": "folder",
                                                    "prnt": "blog",
                                                    "children":     [
                                                                        {
                                                                            "name": "blog-post",
                                                                            "date": "",
                                                                            "type": "blog-post"
                                                                        }
                                                                    ]
                                                },
                                                {
                                                    "name": "tags",
                                                    "date": window.latestPostDate,
                                                    "type": "folder",
                                                    "prnt": "blog",
                                                    "children":     [
                                                                        {
                                                                            "name": "blog-tag",
                                                                            "date": "",
                                                                            "type": "blog-tag"
                                                                        }
                                                                    ]
                                                },
                                                {
                                                    "name": "about",
                                                    "date": "2017-03-24",
                                                    "type": "file",
                                                    "content": "fill in"
                                                }
                                            ]
                            },
                            {
                                "name": "credits",
                                "date": "2017-03-24",
                                "type": "file",
                                "content": "// Site content and functions by Philip Ulrich \n// JQuery Terminal interface by Jakub Jankiewicz [[!;;]http://terminal.jcubic.pl]\n// Blog software by Ghost [[!;;]https://ghost.org]"
                            }
                        ]
        }
    ]
});

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
var dirColor = '[[b;#0225c7;]'              // Color Of Dir In ls
var isPause  = false;
var termDir  = dirPerms + " " + termOwner + " " + termGroup + " {x} " + dirColor;
var termFile = filePerms + " " + termOwner + " " + termGroup + " {x} ";
var title    =  "// This site is currently under construction. Don't mind the mess.\n\n\n" +
                "+==================================================================================+\n" +
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
var helpText =  "Help Text"; //TODO
window.posts = getPosts();

/////////////
// Program //
/////////////
var processor = {
    help: function() {
        this.echo(helpText);
        ga('send', 'event', 'help', path);
    },
    echo: function(text) {
        if (typeof text !== 'undefined') {
            this.echo(text);
        } else {
            this.echo("usage: echo [text]");
        }
        ga('send', 'event', 'echo', path + ' ' + isDefined(text));
    },
    ls: function(options) {
        list      = '';
        listItems = getObjects(window.fileStructure,'name', path)[0]['children'];
        fileCount = listItems.length - 1;
        if (typeof options === 'undefined' || options == '-l') {
            listItems = listItems.filter(function (item) {
               return item['name'].indexOf(".") !== 0;
            });
            fileCount = listItems.length - 1;
        }
        if (typeof options === 'undefined' || options == '-a') {
            if (path == 'posts') {
                window.posts.success(function (data) {
                    $.each(data.posts, function(index, value) {
                        list += value['slug'] + '   ';
                    });
                })
            } else {
                $.each(listItems, function(index, value) {
                    if (getObjects(window.fileStructure, 'name', value['name'])[0]['type'] == 'file') {
                        list += value['name'] + '   ';
                    } else {
                        list += dirColor + value['name'] + ']   ';
                    }
                })
            }
        } else if (options == '-l' || options == '-al' || options == '-la') {
            if (path == 'posts') {
                window.posts.success(function (data) {
                    postCount = data['posts'].length - 1;
                    $.each(data.posts, function(index, value) {
                        if (postCount == index) {
                            list += format(termFile,[value['updated_at'].substring(0,10)]) + value.slug;
                        } else {
                            list += format(termFile,[value['updated_at'].substring(0,10)]) + value.slug + '\n';
                        }
                    });
                });
            } else {
                $.each(listItems, function(index, value) {
                    if (getObjects(window.fileStructure, 'name', value['name'])[0]['type'] == 'file') {
                        if (fileCount == index) {
                            list += format(termFile, [value['date']]) + value['name'];
                        } else {
                            list += format(termFile, [value['date']]) + value['name'] + '\n';
                        }
                    } else {
                        if (fileCount == index) {
                            list += format(termDir, [value['date']]) + value['name'] + ']';
                        } else {
                            list += format(termDir, [value['date']]) + value['name'] + ']' + '\n';
                        }
                    }
                })
            }
        } else if (options == '--help') {
            this.echo("usage: ls [-al]");
        } else {
            this.echo("ls: invalid option -- " + options + "\n" +
                      "Try 'ls --help' for more information");
        }
        this.echo(list);
        ga('send', 'event', 'ls', path + ' ' + isDefined(options));
    },
    cd: function(folder) {
        // cd should understand relative location better...
        if (typeof folder !== 'undefined') {
            folderContent = getObjects(window.fileStructure,'name',folder);
            if (folderContent['length'] > 0 && folderContent[0]['type'] == 'folder') {
                path = folder;
            } else if (folderContent['length'] > 0 && folderContent[0]['type'] == 'file') {
                this.echo(errText("-bash: cd: '" + folder + "': Not a directory"));
            } else if (folder == '.') {
                path = path;
            } else if (folder == '..' || folder == '../') {
                parentFolder = getObjects(window.fileStructure,'name',path);
                path = parentFolder[0]['prnt'];
            } else {
                this.echo(errText("-bash: cd: '" + folder + "': No such file or directory"));
            }
        } else {
            path = '~';
        }
        ga('send', 'event', 'cd', path + ' ' + isDefined(folder));
    },
    cat: function(file) {
        if (typeof file !== 'undefined') {
            fileContent = getObjects(window.fileStructure,'name',file);
            that = this;
            if (path == 'posts') {
                getPost(file).success(function (data) {
                    that.clear();
                    isPause = true;
                    that.echo(errText('Press ctrl-d to exit'));
                    that.echo(data['posts'][0]['html'],{raw:true});
                    setTimeout(function() {
                        window.scrollTo(0,0);
                    }, (500));
                });
                getPost(file).fail(function (data) {
                    that.echo(errText("-bash: cat: '" + file + "': No such file."));
                    that.resume();
                });
                this.pause();
            } else if (fileContent['length'] > 0 && fileContent[0]['type'] == 'file') {
                this.echo(fileContent[0]['content']);
            } else {
                this.echo(errText("-bash: cat: '" + file + "': No such file."));
            }
        } else {
            this.echo("usage: cat [filename]");
        }
        ga('send', 'event', 'cat', path + ' ' + isDefined(file));
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
        },
        onResume: function() {
            if (isPause) {
                isPause = false;
                this.reset();
            }
        }
    });
});


//example of grabbing objects that match some key and value in JSON
//console.log(getObjects(js,'name','example-file3'));
//returns file in 0 for content

//example of grabbing objects that match some key in JSON
//console.log(getObjects(js,'name',''));
//returns all objects that have key in context

//example of grabbing obejcts that match some value in JSON
//console.log(getObjects(js,'','file'));
//returns all objects that have value in context

//example of grabbing values from any key passed in JSON
//console.log(getValues(js,'name'));
//returns all values for key in list

//example of grabbing keys by searching via values in JSON
//console.log(getKeys(js,'example-file2'));
//returns key of value (likely not useful)
