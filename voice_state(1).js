registerPlugin({
    name: 'Voice State',
    version: '2.0',
    description: 'Caches the voice states',
    author: 'Lala Sabathil <aiko@aitsys.dev>',
    engine: '>= 1.0.0',
    backends: ['discord'],
    requiredModules: [],
    autorun: true,
    vars: []
}, function(_, config, meta) {
    var event = require('event');
    var engine = require('engine');
    var backend = require('backend');
    var store = require('store');

    const errorMessages = {
        NotLoggedIn: "You are not logged in",
        NotBound: "This account is not bound to a discord user",
        UserNotConnected: "You are not connected",
        NotConnected: "The bot is not connected",
        NotSameChannel: "You are not in the same channel with the bot"
    };

    engine.log("Voice State loaded!");

    event.on('discord:VOICE_STATE_UPDATE', function (ev) {
        var cid = ev.channel_id;
        if (typeof cid === undefined || cid == null) {
                store.unsetGlobal('voicestate-' + ev.user_id);
                engine.log('User ' + ev.user_id + ' is disconnected');
        } else {
            if (store.getGlobal('voicestate-' + ev.user_id) == null) {
                store.setGlobal('voicestate-' + ev.user_id, ev.channel_id);
                engine.log('User ' + ev.user_id + ' connected.');
            } else {
                store.setGlobal('voicestate-' + ev.user_id, ev.channel_id);
                engine.log('User ' + ev.user_id + ' is already connected');
            }
        }
    });

    event.on('api:voicestate', ev => {
        const res = new Response();
        var user_uid = ev.user().uid().split("/").pop();
        engine.log(user_uid);
        if (!ev.user()) {
            res.setError(errorMessages.NotLoggedIn);
            return res.getData();
        }
        if (!user_uid) {
            res.setError(errorMessages.NotBound);
            return res.getData();
        }

        var state = store.getGlobal('voicestate-' + user_uid);
        var cur_chan = backend.getCurrentChannel().id().split("/").pop();
	engine.log(state + " ? " + cur_chan);
        if (state != null && state == cur_chan) {
            res.setData({ user: user_uid, connected: true, channel: state });
            return res.getData();
        } else if (state != null && state != cur_chan) {
            res.setError(errorMessages.NotSameChannel);
            return res.getData();
        } else {
            res.setError(errorMessages.UserNotConnected);
            return res.getData();
        }
    });

    class Response {
        constructor() {
            this.success = true;
            this.data = null;
        }
        setData(data) {
            this.data = data;
        }
        getData() {
            return {
                data: this.data,
                success: this.success
            }
        }
        setError(error) {
            this.success = false;
            this.data = error;
        };
    }

});
