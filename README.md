naive.html is a simple experiment using system time (presumably from
NTP) to try to play back the same track from multiple devices
simultaneously.

firebase.html uses Firebase in order to get more precise clock syncing,
doing something like NTP but more often.

compare.html has iframes side-by-side, so you can hear the latency
difference between two time clients. This mode also plays back pings
every n seconds.

haas.html plays the same sound with a delay.
