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
                                                    "name": "id_rsa",
                                                    "date": "2017-03-24",
                                                    "type": "file",
                                                    "prnt": ".ssh",
                                                    "content": "HA! Nice try."
                                                },
                                                {
                                                    "name": "id_rsa.pub",
                                                    "date": "2017-03-24",
                                                    "type": "file",
                                                    "prnt": ".ssh",
                                                    "content": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC9lEoyLPngAETHRxxdx7TGAwH/l3D7mwVDxZB6QYzumnbbxtDZipjmTYGKmD0LodVPe1h7FjFzCnO3qkuc60WCRa0wITEDC1IIyqM0ML8mMex7Sl0e5Ksa/xHkl83MgH+kJdQX4NWr4qmGdVV1FNHsddJDv1T36ZOkFdRqAmMCogvQpZYdOqJSpgILo8h/0aiMdWmZHqBUvCdO64VxrYSb+zhZe104fjX87wNv1eFDc0/pr0zQsAyJSkofFpgeb0VGhusOREbpcfnAvBY/ejye8RCs6Sen135D1ANvrSDB2c7P2XoIoqS+EO72B5yYIvm3qFzR6hstJYbvIS+MxbD7hUe7jSTl/Wf9IPjAgzNnImeqYZLbni3JZzcpnpFRRJ1G6lhbgR83dxvkx/d7TosmL6RkZ5LX7yCE2LMShCd151xilRg/Vf11qIqtoH2WMPrFfN2VMGjr4sN2+TXVMxnTT4lMBkTB86IbDME2VwqwxwyWAdjr3RGzag2fbW5+aEdW306RD3VV2bWWCXDNcCXMNEsko8ylrhmz+5WP7WnzlhhLzEEM4hkIsP/slpFA0FIrTKidG1PNEaNWaka/+yHACGAJTMdm+5MpLVYl0vP18LUWPGGXzmnECcgnse56+OhTGQAwJh93sdMS/37CP8MgpvJRwSfxYrr6x0cy1OZ5XQ== philip@exec.tech"
                                                }
                                            ]
                            },
                            {
                                "name": "about",
                                "date": "2017-04-01",
                                "type": "folder",
                                "prnt": "~",
                                "children":   [
                                                {
                                                    "name": "author",
                                                    "date": "2017-04-01",
                                                    "type": "folder",
                                                    "prnt": "about",
                                                    "children":     [
                                                                        {
                                                                            "name": "basic-info",
                                                                            "date": "2017-04-01",
                                                                            "type": "file",
                                                                            "prnt": "author",
                                                                            "content": "Name:       Philip Ulrich<br />" +
                                                                                       "Email:      philip@exec.tech<br />" +
                                                                                       "Location:   Austin, TX<br />" +
                                                                                       "Profession: System Administrator & Junior Developer<br />" +
                                                                                       "Employment: Currently a Windows Administrator at Rackspace, but am open to discussing interesting oppurtunities.<br />" +
                                                                                       "Homepage:   <a href=\"https://exec.tech/\">https://exec.tech/</a><br />" +
                                                                                       "LinkedIn:   <a href=\"https://www.linkedin.com/in/philipculrich/\">https://www.linkedin.com/in/philipculrich/</a>"
                                                                        },
                                                                        {
                                                                            "name": "pgp-key",
                                                                            "date": "2017-03-24",
                                                                            "type": "file",
                                                                            "prnt": "author",
                                                                            "content": "-----BEGIN PGP PUBLIC KEY BLOCK-----<br />Version: Keybase OpenPGP v2.0.66<br />Comment: https://keybase.io/philip_ulrich<br />xsFNBFjRMtwBEADXJdU65cjCEnLJatGKKnATKrCcgOAnrU8r9uQUx3yOBD077bew<br />XHiIek0WlI7cFxKl7WHl0U+6/CQsOt6h6ylboP5SI1mvN7zHyyGv+yNKtbW+VwVo<br />U7bfWzNXXWq44e6wV/HG7xKftGbedqBhFKmCRWSkanaiIMFQzFOko+6h9qxKnLXD<br />npkuveFEZaDa23Yfi+4fEPMypBfpSvO9omVCpMak0M4j+135hHjSoGjGIGyOS9Sb<br />ZXy6PK25k8e8/JtL9DFFx2Ig96x0wQRxIaoCNjVPv0AmMBxpfgnzIninwDzQjrq8<br />grb7+tZ2VyYG+9qtrd3wSMDSRkpz956uKHRDi67/W5rI6Wj5smTNjgz/RoqmZsv/<br />dzUJ6mAhrhifw01R3p3Q4Hv4aI0Roik3E9K1AZswA//9UvtaXIWXqQa2O8oV3SJd<br />9dWD5et3TYlawz/mIqBtHzbOFdz70aNZG4PZkI9/wm+OV6BT32U2pdewc2juRdVQ<br />6wdFK5zhBvIWQLj1Fb6cM3s2pqqY1539TeLsX+PqDZzh4IzXzSDY31ZmdW5M+Y0S<br />ANLP5hXjqboryELeCThH3xGwHZ7eDi43SA/bz7uoZaF1V8EC8cPhCuG0wgT17Tdm<br />2t72nj9DjddVJXUsODQgDotFHDs7AlUqFXXjK+yK7WSMOSjfe2+69W1hsQARAQAB<br />zSBQaGlsaXAgVWxyaWNoIDxwaGlsaXBAZXhlYy50ZWNoPsLBdAQTAQoAHgUCWNEy<br />3AIbAwMLCQcDFQoIAh4BAheAAxYCAQIZAQAKCRB5YHRstjBC67aTD/9cpjj+3sgh<br />lTxj+tB9LaQqpT17J/3tNcnLepy/P0CeIugA41vYdU+vDCnsAUvNVzR/M68acRcR<br />OZsD0ooIEvqde8UnPzNLuPSDO1gdFPWc0hh+xEdvnX8WXqbpuTPiIvm5rY/KBlF/<br />eIDDBAQqCDjjKwkshHUgVVv6yetuyUxghKeYtfQhcUgh9GfglwoN/F9taBenux7A<br />Kp8GXnAN6Yy1Y3m54mPUjBBRX+95Mhbq8nDRqF/+1PAGpdUOIkhNVRg9RhGKaiWC<br />OMGrkm/7grmN/WqbnE+E1F8rc844coRfr3OjT6V6SixbS/4bGw8ksGxS1qWeg+ss<br />tlCAVR0WLwnHOmHZQGNL/htriswBx1vQHcGZhICfsGRJQ3RSTNvim75cs3eCiizR<br />9kRq1ag9SjqFAI/FjaEwAbbvxXbeT7jSQm3dOZ1KMMkIEVxPDg1v9ZfBleeQ2D8l<br />L87cSjlk8+rbzMp8h50tqc+TcXCcWaFWiBWj4u0YYjQ62b0rCl0pGA1aJddqjaIt<br />x0UK3mo/qOvWhP1V9lUoR17wvwUpBl/O1j4G+yZJ1pTzzz3NZdG55q7dBIHWfCPy<br />0AvbJk4DhmjCsBepW/dCARkdMLaGJ1f9/fUDIR8/aZE4VkFEwf0C9o0PD7r89HLz<br />OqhvnkXmNPoxYlEM+xVAdMlgZPaade7KLs7ATQRY0TLcAQgA7ewIHKQX7Pmpicwj<br />zoctqtD8tAtWnDSCs4Fheq8XXNFD4IENC8pBepSQCO2NxdGO3PbpXslK7W5GxxgX<br />xY5PZCYUyMBWKgGNaLgWrggywVuDDCKY9oQycCTb0zpnwHRGI6leC8X1+9jcmcmi<br />aBGnwxcAWRTXyCaJFyLwKLB+dHWGo9FPh0EoItULbnB28YxbLYAbyD0JO8WGi35K<br />vDxbW+eAgvf+WGlmbF3CBTeQL65YOf7QfG6TznNWA1La7EPvl9WikO/ZKLp/s3vz<br />CKzjvDgc1sQJ1MR5GuUNzic+dao02uCcs5nlx564lUKasM21oVM5lwxwPKB20HKS<br />569zCwARAQABwsKEBBgBCgAPBQJY0TLcBQkPCZwAAhsMASkJEHlgdGy2MELrwF0g<br />BBkBCgAGBQJY0TLcAAoJEBi6LdvzjrB7PrwIAL70nFkxtkTSqhICMNtWHaCZv/nH<br />iaMnhRebvohA6IC1Wltrjy7/QsPo4Rv+CRcyBpYxhPyCoSHObT52fgIj+G68gqgZ<br />bmO30AfEaYkLkCDEW49Y9EVrkIQ7TTmqHIyemQUuPvaL3mqMlIuL84AV/hQU++Ef<br />jrynIcnCHcp4u2H8LXbiSv25N5MmhmovVI4cjOkFcewSZ9T/KoeE+mXypjG1u9md<br />nmF7r1nK/jzswuEfxzXCxn1R1F5zA1tyf2RjHKK49S28tWGSzvymXYhRNP26d0nl<br />Ka+mWcA0Zjagnj1B1XGFCZv3UyTC/TYoKdLlXJsiYf6KEUo/5zSaihq6xQuZ6BAA<br />ze/b7+h5m2YMFS+g5fLCdv1VNibep4x5UJwwd5phu4iJ3n9+l1vOmCuSYjmQL1u6<br />t7o1/Z2TP2kYS1qMDOMFgwyXBnzaaYXDjD27ShbsOUkx9oNppQZXWB7maRa+xj74<br />1CVwKNvUSW8jmdoJLUo+e8RzcnDB0yNjJAIw7oN6r+WifVh76HEwC83xTE45wdHG<br />2HTpFQ+7HgQ4aNX4A++xWfXNJRIGQ0Q16dsCInq+gJ4VszdxPDo/Z86Rfcn2YVlF<br />SCXMIbd1E2Y8HukjxrvTkXZ8NYqhzBKeU9HRtHQC7vn4EZLff7Wldo0feZkwYhRD<br />0hJhEIE3E5wvLbW9Z71Z5aUK2xzHNhdCuePVskz1L0WDD/poBmML+BKbeYXDxERp<br />e/6mAPglN9hcf3FEhpBJhGs+YzR8HpN2MeDfxV4s5URf4t5Q44e3Ew3YSl5zfcqV<br />O+E/zD+Y6XLGBZrEuKuaHc8ThNWaWN67otRLLIWBQC9SV/Glj7Z7kJNVneA+5D1K<br />yubTq0FpwXprGq0Us218uShq+lXrDhshPgjVC+UeNdcwZXUjVWRrgLudKn23Fwm5<br />GU1mL3cu1E2rnIuWXlNqghTQtzhJvTWrqork7n4uoeNJWIFW3ql+pB0Ue5FB378q<br />Jh5wlam+j28hs4P4RPnEquUSZzmyoYX7zYfTJ/xpwyHOwE0EWNEy3AEIALRe+OjR<br />Ef9KE3uc2T6GAa4f4QH7t15MTy7m/jXYlaVrJyx8rzVCQU+4GkiImQ5jkkqGs3Il<br />ZXGHXSxGtvP7yjK3f0JTwSEgKRvpKqfjgGlGl+L4T0BjBR1MMoDqWF2B7NZTxAb7<br />kvKt+s/ZjQDP5w6mcCKLnKszVN+8aaFytnSp/kWfW/silk3zE8AvpYVruq1cTLI2<br />Ooqa6ZBJUeCYHLo4R9qFFRILHWvH2CV3Bruqlj+OWiX0JojHnbmfrUTkPqKRwyBN<br />cL48j3pc/J37kExI9Oniq7uz3IzEVoq22bNRg5BWSEgu+Xs/8ioZMj/p3qCQyceS<br />Bl2D5gLKu7Dq3WcAEQEAAcLChAQYAQoADwUCWNEy3AUJDwmcAAIbIgEpCRB5YHRs<br />tjBC68BdIAQZAQoABgUCWNEy3AAKCRCtL2gzzPmTHCXoCACahs6ce2IFUhMc9sR7<br />cYQEzvR7H3hJv3MlZFU3Tw/O5peTM+/jgQAe6JMhBiUl3avn2DlWGr5ZTdIh9lYM<br />Byy6LbZYuF0ntzOgdjOABKiAtMfkA6xFqJoCgO7EC0Cz5qTGzEIQGEZq0gm23Ry4<br />C+MUGPJDzf7hnESZ/lZeCvBtjcd4iXqcyhz+mPGv22Bnl/WtvegZ+erlnIZBlyhM<br />fT0DahVnaE8AqoVHy/qxKczfbyEigGPdElMvdaDF5OMmSgJicb203LoaTre5NUjP<br />a83uBlFJdv7xFFYoXs2SMfYpBy9wQn4TWk8jkupQ6HpNVcSHwD9lC8AeIhjLkQsp<br />LydFp80QAIvI98UJJEoKppxwa1Qjgpao+WxFELxUZfnqFpcxqv+pV45b5CBz80Fm<br />sXJ9V+mgRyTbtV6KgE1UN+1F6y+49JlsFI9w9IV1eWB8CvDY8/IoWv1BClDk5E/r<br />e/FT3OVujlZYKK4htxLzcT9eaVV01blaB+A2qFLoU/G0m1O8xlpLf2PDmJ5TjilQ<br />lHoafjb6hqUXRktNEjIkaz9BLFYZqIn8Zie6mjn4a+yyls35BkoVoxzFQVB8XHwm<br />pVmmd4sYVTHU8+wELtwoIC/NKow6RZM4+vXwMKvDSzwr9/KWbVguHLjJuocxI+oV<br />ZedBW1K8Dbps+SeqbiubuuvlyXMX0Jt1ENy5Dw9TQBlzCY/upEHmLjAHnsko5yBk<br />ybCtvFNQKrHLzZgTEo5IbBegi/x5+m7T2Shlfhfe+0Bi+s/n33Ggjkxv6rsrkaP5<br />DLMh827AY8vBbAZmrdvqt/1jOHbL2Rv/u4ErL/7ZH+91IrKbHYrm87fQTh4U7JAF<br />uMB7uX0waeA4q34v1vjKfCws16SV0XyQxcI+iwhOVasHOx1QYCj76KLjli2YscP6<br />J15Af5+TXySL4+DYDt8sAi9mBFEX8ZuIzNuoIWPp57UiStatqozdEd0qLPA4yTRs<br />2W4RcwosAQHIWhPES3joTJc7L5dfoGBxGnfNovqqE7PXxenzo6AT<br />=Wuq8<br />-----END PGP PUBLIC KEY BLOCK-----"
                                                                        },
                                                                        {
                                                                            "name": "strengths",
                                                                            "date": "2017-04-01",
                                                                            "type": "file",
                                                                            "prnt": "author",
                                                                            "content": "Gallup StrengthsFinder Strengths:<br />- Learner<br />- Analytical<br />- Individualization<br />- Activator<br />- Ideation"
                                                                        },
                                                                        {
                                                                            "name": "summary",
                                                                            "date": "2017-04-01",
                                                                            "type": "file",
                                                                            "prnt": "author",
                                                                            "content": "BS, Information Technology with a minor in Computer Science. Driven worker with experience in many aspects of technology ranging from consultation to user support to server administration to programing. Currently employed as a Windows Administrator and looking to advance my career by getting into DevOps or Development."
                                                                        }
                                                                    ]
                                                },
                                                {
                                                    "name": "site",
                                                    "date": "2017-04-01",
                                                    "type": "folder",
                                                    "prnt": "about",
                                                    "children":     [
                                                                        {
                                                                            "name": "introduction",
                                                                            "date": "2017-04-05",
                                                                            "type": "file",
                                                                            "prnt": "site",
                                                                            "content": "<h2>Introduction</h2><p>At some point I think we all have the thought of creating a blog and expressing our thoughts and knowledge publicly for all to see (or in most cases, only a few people). I personally have had that thought a few times but took no action on it. First it was a Minecraft blog<sup>1</sup>. Then it was a blog for my family since I left social media behind<sup>2</sup>. Then when I started at Rackspace, I became somewhat notorious with a pretty large group of people that I joined with for wearing a tiny sombrero and I thought about creating a blog about my adventures there<sup>3</sup>. None of these ever came to fruition though. Why? Well we'll get there. This, though, is the blog that finally came to fruition! The blog about my favorite topic: nerdy things. Because, well, I'm a nerd and proud of it. </p><p><em><sup>1</sup> Okay, yes, I used to greatly enjoy Minecraft... I still do actually, just mostly single player</em><em><sup>2</sup> Let's be honest, social media is a *HUGE</em> time waster*<em><sup>3</sup> It's a somewhat odd story. I'll write about it sometime.</em></p><h3>Who Am I?</h3><p>At this point you might be wondering who I am and that's a fair question to be asking. My name is Philip Ulrich. I am 24 and currently employed at Rackspace as a Windows Systems Administrator for the enterprise segment of our operations<sup>1</sup>. I greatly enjoy everything technology related and am constantly learning about something. Ultimately I am feeling like I would like to become a software engineer full time, but I have yet to find a position that fits my paper qualifications (or lack thereof). If you ask my wife about it, she'll probably mention all the computers I have in the house.. how the apartment we live in is nearly fully automated.. and how hot the bedroom gets with all the servers running on or around my desk<sup>2</sup>. It's a problem sometimes, but a problem I love to have and she has learned to both live with it and sometimes even enjoy and benefit from it. </p><p><em><sup>1</sup> The esteem among you might be asking \"Why choose Windows?\" (no offense to people who actually like Windows). Long story short, it's what I was doing in college as an IT Consultant and a job was available where I wanted to relocate.</em><em><sup>2</sup> I have a 24 port gigabit switch nearly full.</em></p><h3>What You Can Expect From This Blog</h3><p>My blog is honestly going to be like a bag of Hershey's assorted chocolate nuggets. It'll be a lot of random stuff including some things you probably don't like. I'll try to keep things organized for you though with tags so that you can avoid that nasty dark chocolate. Comedy aside though, it's mostly going to be about technology, my life, and things that interest me. It also will contain lots of grammatical errors including misspellings, run ons, &lt; and wonderful (and controversial) things like the oxford comma<sup>1</sup>. Trust me, my blog writing is not for the faint of heart.<sup>2</sup></p><p><em><sup>1</sup> I love oxford commas and greatly dislike when branding standards exclude the use of them.</em><em><sup>2</sup> I am competent enough to write technical documents that are mostly grammatically correct though, so don't worry about that.</em></p><h3>What If You Were Sent Here By My Resume/Application/LinkedIn/Other?</h3><p>Welcome! I'm super happy that you are navigating around my command line successfully. Take a look around, let me know if you have questions or want to chat more. You should have my contact information, but if you want to talk informally or lack my contact info.. keep reading.</p><h3>Want To Chat?</h3><p>I'm honestly not expecting many to have in interest in chatting, but I do have a blog slack for playing with bots and such. It also has a channel that announces when posts are made. If you have questions about me or the things I write, want to point out an error, want to discuss a project of mine, or even just want to talk tech; feel free to join up: <a href=\"https://exec-tech.signup.team\">https://exec-tech.signup.team</a>.</p><h3>Want More?</h3><p>Well, get to reading. There is more information about me and some of the topics discussed in my first blog post with the slug: yet-another-blog</p>"
                                                                        },
                                                                        {
                                                                            "name": "credits",
                                                                            "date": "2017-03-24",
                                                                            "type": "file",
                                                                            "prnt": "site",
                                                                            "content": "// Site content and functions by Philip Ulrich <br />// JQuery Terminal interface by Jakub Jankiewicz <a href=\"http://terminal.jcubic.pl\">http://terminal.jcubic.pl</a><br />// Blog software by Ghost <a href=\"https://ghost.org\">https://ghost.org</a>"
                                                                        }
                                                                    ]
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
                                                }
                                            ]
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
var title    =  "+==================================================================================+\n" +
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
var tipText  =  "This site costs next to nothing to run, but if you have some extra coin you want to give away... I'll take it. ;)\n" +
                "Bitcoin:  [[b;#44D544;]1AEJoDStpCqtxgADPuqM5WrAUQqDgjpwtA]\n" +
                "Ethereum: [[b;#44D544;]0xE76cbF2A9B48d70Ab9a2185B9eb4EcE273058F5E]";
var helpText =  "Commands:\n"+
                "cat [filename] - read a file\n"+
                "cd [folder]    - change directory\n"+
                "clear          - clear the screen\n"+
                "echo [text]    - echo text\n"+
                "help           - this text response\n"+
                "ls [-al]       - list current directory\n"+
                "tip            - learn how to tip the author";
window.posts = getPosts();

/////////////
// Program //
/////////////
var processor = {
    cat: function(file) {
        // should take into account relative location + show differently based on length
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
                this.echo(fileContent[0]['content'],{raw:true});
            } else {
                this.echo(errText("-bash: cat: '" + file + "': No such file."));
            }
        } else {
            this.echo("usage: cat [filename]");
        }
        ga('send', 'event', 'cat', path + ' ' + isDefined(file));
    },
    cd: function(folder) {
        // cd should understand relative location better...
        if (typeof folder !== 'undefined') {
            folderContent = getObjects(window.fileStructure,'name',folder);
            if (folderContent['length'] > 0 && folderContent[0]['type'] == 'folder') {
                path = folder;
            } else if (folderContent['length'] > 0 && (folderContent[0]['type'] == 'file') ) {
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
    echo: function(text) {
        if (typeof text !== 'undefined') {
            this.echo(text);
        } else {
            this.echo("usage: echo [text]");
        }
        ga('send', 'event', 'echo', path + ' ' + isDefined(text));
    },
    help: function() {
        this.echo(helpText);
        ga('send', 'event', 'help', path);
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
    tip: function() {
        this.echo(tipText);
        ga('send', 'event', 'tip', path);
    }
}

jQuery(document).ready(function($) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = "https://exec.tech/gui";
    }
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
