    CodeMirror.defineMode("mrbreaknfix", function() {
        var keywords = ["execute_command", "teleport_player", "mark_location_with_redstone_block", "give_player_diamonds", "wait", "function"];

        var keywordRegex = new RegExp("\\b(" + keywords.join("|") + ")\\b");

        return {
            token: function(stream, state) {
                if (stream.match(keywordRegex)) {
                    return "keyword";
                }

                // Match comments
                if (stream.match("//")) {
                    stream.skipToEnd();
                    return "comment";
                }

                stream.next();
                return null;
            }
        };
    });
