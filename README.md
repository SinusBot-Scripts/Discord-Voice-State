# Discord Voice States

This plugin caches the voicestate of a webuser and checks if the bot is in the same channel as the webuser.

## API Calls
- POST `{URL}/api/v1/bot/i/{instance_id}/event/voicestate` (You must be logged in)

## Possible Errors
- NotLoggedIn: "You are not logged in"
- NotBound: "This account is not bound to a discord user"
- UserNotConnected: "You are not connected"
- NotConnected: "The bot is not connected" (Unused atm)
- NotSameChannel: "You are not in the same channel with the bot"

## Example Webscript
```js
function isConnectedToVoice(instance, response) {
    $.ajax({
        url: 'http://127.0.0.1:8087/api/v1/bot/i/' + instance + '/event/voicestate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + window.localStorage.token
        }
    }).done(function (data) {
        if (data.length == 0) {

            console.log("Voice API Error: We did not received data!");

            response(false);

            return;
        }
        if (data[0].success) {
            response(data[0].success);
        } else {
            console.log("Voice Error: " + data[0].data);
            response(data[0].success);
        }
    });
}
```

```js
isConnectedToVoice("instance-uid", function(result) {
    if(result) {
        alert("Everything okay");
        // Do stuff
    } else {
        alert("Something went wrong. See console log.");
    }
});
```

### Returns

#### Error JSON:
```json
{
  "data": "Error",
  "success": false
}
```

#### Success JSON:
```json
{
  "data": {
    "channel": "809889361767956551",
    "connected": true,
    "user": "199858858166976513"
  },
  "success": true
}
```
![Preview1](https://forum.sinusbot.com/attachments/1623708297457-png.4407)
![Preview2](https://forum.sinusbot.com/attachments/1623708303454-png.4408)

## Example Script
```js
var store = require('store');
var event = require('event');

event.on('chat', ev => {
    let channel_id = store.getGlobal('voicestate-' + ev.user().uid().split("/").pop());
    if (channel_id != null) {
        // Do stuff with channel_id
    }
});
```
