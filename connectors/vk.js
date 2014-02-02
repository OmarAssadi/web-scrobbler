var lastTrack = null;
var $r = chrome.runtime.sendMessage;

function scrobble(e) {
    var artist = $("#gp_performer").text();
    var title = $("#gp_title").text();

    if (lastTrack != artist + " " + title) {
        lastTrack = artist + " " + title;

        $r({type: 'validate', artist: artist, track: title}, function(response) {
            if (response != false) {
                $r({
                    type: 'nowPlaying',
                    artist: response.artist,
                    track: response.track,
                    duration: Math.floor(response.duration / 1000)
                });
            } else {
                $r({type: 'nowPlaying'});
            }
        });
    }
}

$(function() {
    $(window).unload(function() {
		// reset the background scrobbler song data
		chrome.runtime.sendMessage({type: 'reset'});
		return true;
    });

    $(document).bind("DOMNodeInserted", function(e) {
        if (e.target.id === "gp_performer") {
			$("#gp_info>div").bind('DOMSubtreeModified', function(e) { setTimeout(scrobble, 500) });
		}
    });
});


/**
 * Listen for requests from scrobbler.js
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.type) {

            // background calls this to see if the script is already injected
            case 'ping':
                sendResponse(true);
                break;
        }
    }
);

