# SBaGen -- Sequenced Binaural Beat Generator

This is my utility, released under the GNU GPL v2 (see the file
COPYING), that generates pink noise and binaural tones through your
soundcard in real-time according to a 24-hour programmed sequence read
from a file.  It can also be used to play a sequence on demand, rather
than according to the clock.  MP3 or OGG soundtracks may also be mixed
in instead of pink noise.

The original idea was to program a set of tones to play overnight as I
slept, hoping to improve dreaming and dream-recall.  That way, I could
also program the sequence to bring me up into alpha rhythms to
hopefully have a good start to the day.  More recently I have been
working with shorter, more focussed sessions of about an hour, which I
listen to either during the day or at night.

Some of the more interesting uses (for me) of binaural tones I've read
about include: improving dream-recall, entering lucid dreaming,
facilitating meditation, accessing intuition, exploring consciousness,
emotional clearing, and training in altered states.

USE AND EXPERIMENT AT YOUR OWN RISK!

If you make any changes or improvements to the code, let me know so
that I can keep the master copy up to date.  Also, if you come up with
any interesting tone-sets or sequences that you would like to share,
along with their story, please post them on the mailing list (see
http://sbagen.sf.net/).  Thanks to the SBaGen community we now also
have a Wiki where you can post stuff.

Jim Peters, Jan-1999                         <http://uazu.net/sbagen/> 
(updated Sep-2001, Apr-2002, Sep-2003, Apr-2004)


Contents of this document:
-------------------------

1. [Legal notice](#legal-notice)
2. [Theory](#theory)
3. [Installation](#installation)
  1. [Installation for Windows users](#installation-for-windows-users)
  2. [Installation for Mac OS X users](#installation-for-mac-os-x-users)
  3. [Installation for Linux and other UNIX users](#installation-for-linux-and-other-unix-users)
4. [Invocation](#Invocation)
  1. [Outputting to a pipe or a file](#outputting-to-a-pipe-or-a-file)
  2. [Mixing in background sounds](#mixing-in-background-sounds)
  3. [Standard background sounds](#standard-background-sounds)
  4. [Creating loopable OGGs](#creating-loopable-oggs)
    1. [Using ReplayGain with OGG files](#using-replaygain-with-ogg-files)
  5. [Compensating for headphone low frequency roll-off](#compensating-for-headphone-low-frequency-roll-off)
  6. [The `drop` sequences](#the-drop-sequences)
    1. [More detailed notes on `-p drop` options](#more-detailed-notes-on-p-drop-options)
    2. [Adjusting the length of a `-p drop` session](#adjusting-the-length-of-a-drop-session)
  7. [The `slide` sequences](#the-slide-sequences)
5. [Writing sequence files](#writing-sequence-files)
  1. [The sequence-file format](#the-sequence-file-format)
    1. [Command-line options within the sequence file](#command-line-options-within-the-sequence-file)
    2. [Tone-set definition lines](#tone-set-definition-lines)
    3. [Time-sequence lines](#time-sequence-lines)
    4. [Block definition lines](#block-definition-lines)
  2. [Multiple sequence files](#multiple-sequence-files)
6. [Conclusion](#conclusion)
7. [Appendix: User-defined waveforms](#appendix-user-defined-waveforms)


## Legal notice

SBaGen -- Sequenced Binaural Beat Generator
Copyright (c) 1999-2005 Jim Peters, http://uazu.net/
  
  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, version 2.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  
  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

"River sounds" loopable OGG files (river1.ogg, river2.ogg)
Copyright (c) 2003-2004 Jim Peters, http://uazu.net/

  These audio files are released under the Creative Commons
  Attribution-ShareAlike license, either version 1.0 or 2.0.  See here
  for details:

  http://creativecommons.org/licenses/by-sa/1.0/


## Theory

The basic idea of binaural beats is that by applying slightly
different frequency sine waves to the two ears, a beating affect is
created in the brain itself, due to the internal wiring of the brain.
If, in the presence of these tones, you relax and let your mind go,
your mind will naturally synchronize with the beat frequency.  In this
way it is possible to accurately lead the brain to various states,
according to the frequencies that you apply.

It is also possible to play several different tones together, giving
several different beat frequencies, and programming quite a complex
brain-state based on several frequencies (in several different bands).
These complex mixtures of frequencies are the basis of the Hemi-Sync
(TM) process from the [Monroe Institute](http://www.monroeinstitute.org),
based on Robert Monroe's experiments with out-of-body experiences and
so on.

Taking an alternative approach, [CenterPointe](http://www.centerpointe.com)
use single tones, but vary the carrier frequencies to achieve a kind
of emotional cleansing effect, which is also an extremely valuable and
interesting technique.  There may well be other useful binaural beat
based techniques yet to be discovered.

For an overview of the theory of binaural beats and how they affect
the mind, take a look at the Monroe Institute site, and [wikipedia about Hemi-Sync](http://en.wikipedia.org/wiki/Hemi-Sync).

I have been experimenting with this stuff on and off now for several
years, and I know binaural beats can have powerful effects.  Rather
than going for the most powerful effect, though, it seems to me better
to take a more gentle approach but to keep on doing sessions daily.
Using a series like the `-p drop` series allows you to move forwards
at your own pace.

Note that the recommended way to listen to binaural beats is with
headphones.  Any other way causes some of the signal intended for the
left ear to reach the right ear and vice versa, which means that the
effect is less strong.  Also, in both the Monroe Institute and
CenterPointe programmes, the binaural tones are only just audible
above the pink noise or soundtrack, i.e. they are not played too loud.

I originally wrote this utility to help me set up sequences to
experiment on myself.  If you are happy experimenting on yourself,
feel free to use my utility -- but don't blame me if you mis-program
sbagen with an overnight sequence that leaves you relaxing comfortably
in Theta when you should have gone to work!

You know what I'm saying -- **USE AT YOUR OWN RISK**.  If a little bit of
experimentation puts you off, The Monroe Institute and CenterPointe
both sell pre-packaged tapes and CDs with helpline support and that
kind of thing.


Some more theory -- the oscillations in the brain are split into four
'bands' according to frequency:

-  **Delta** (0.5 to 4 Hz).  This is normally generated in deep sleep, or
when unconsious.  Those experienced in deep trance states can generate
these waves whilst remaining conscious.

-  **Theta** (4 to 8 Hz).  This is the region between sleep and wakefulness,
in which *dreaming* and other dream-like (or 'hypnagogic') experiences
occur.  It's that bit just before you actually fall asleep at night,
or just before you are really awake in the morning.  They say it's in
this band that the unconscious talks to the conscious mind.  It also
seems to be connected with psychic or ESP-type functioning.

-  **Alpha** (8 to 13 Hz).  This is produced when you are awake and fully
conscious, but with your awareness focussed inside, such as when
trying to remember something, or when your eyes are closed.

-  **Beta** (13 to 30 Hz).  This is normally generated when you are awake,
with the attention focussed outside, dealing with the outside world.
It is also generated when you are solving logical problems, such as
mental arithmetic.

It is interesting to note that in normal dreams, a combination of
Theta, Alpha and Beta waves are produced, just as if the person was
awake.  Also, Theta (a sleep frequency) may be generated by skilled
individuals, whilst fully conscious and with their eyes open.  Stuart
Wilde, for instance, talks about training for years with a metronome
to achieve eyes-open Theta (around 4-5Hz).

Anyway, it looks to me like Theta is the place to be, connected with
all kinds of ESP functioning, such as direct 'knowing', and other such
stuff.  I'm sure I've been there many times one way or another, but
I'm looking to explore this area much further now using this utility.

#### References

My source for a lot of the information on brain waves above is the
book: "How to build a lie detector, brain wave monitor and other
secret parapsychological electronics projects" by Mike and Ruth
Wolverton, TAB books, 1981.

I became interested in The Monroe Institute and their activities
through the writings of Ken Eagle Feather, and from attending several
courses of his.  He talks briefly about Hemi-Sync (TM) in "Tracking
Freedom", mentioning some of the 'Focus Levels' (tone-sets) discovered
by the Monroe Institute, which include ones related to out-of-body
experiences and even 'other worlds'.  I believe he also talks about
some of his experiences on Monroe Institute workshops in his first
book "Travelling with Power", although I've not read it (yet).


## Installation

For Windows and Mac OS X users there are pre-build binaries available
from my site.  Linux users must build from source, but I include the
MP3 and Ogg libraries so that this just means running a script.  For
other UNIX users, there are some scripts, and it should be easy enough
to build, but you're somewhat on your own.  If you get in trouble, I
will help if I can, though -- E-mail me.

See my site for a FAQ and other related links:
  
  http://uazu.net/sbagen/


### Installation for Windows users

Since version 1.4.0, I am using InnoSetup for distributing SBaGen,
which gives Windows users a proper installer.  This should make things
very straightforward.  You can still access SBaGen from the DOS prompt
directly if you like (see below), but now you can also do most things
from the desktop:

- To run a sequence, double-click on the icon.  This brings up a DOS
  window in which SBaGen runs.  To stop SBaGen playing, press Ctrl-C.

- To edit a sequence, right-click and select "Edit sequence", which
  will bring up NotePad, or your default editor.

- To write a WAV file from a sequence instead of playing it,
  right-click and select "Write to WAV".  A file `out.wav` will be
  generated.  (Note that this only works well with sequences that have
  a fixed length, otherwise they get a default length of one hour.)
  You can also do this by adding `-Wo out.wav` near the top of a SBG
  file and double-clicking on it.

If you need more features than this, you may still need to use the DOS
prompt, but hopefully you won't, because all the important options can
be included in the SBG file now.


#### Installation of pre-1.4.0 versions for Windows users

Download the ZIP archive and unpack it somewhere suitable.  Unpacking
it in `C:\` seems a good idea to me, because that way it is easier to
find from the DOS prompt.  Alternatively you could unpack it somewhere
else and/or move the directory to some other location you prefer.

To set the utility up to run without using DOS, double-click on one of
the SBG files (for example any of the `prog-*` files).  Windows will
prompt you for the application to use for SBG files, and then use
"Other" or "Locate" to select `SBAGEN.EXE` from wherever you unpacked
it.  You can now run SBG files by double-clicking on them.

This is enough to let you try out most of the supplied files (`prog-*`
and `ts-*`).

However, if you want to get full control over the utility, you need to
use the DOS prompt.  Start up the MS-DOS prompt, and CD to the
directory in which all the files have been unpacked.  For example
(assuming version 1.0.10):

    CD C:\SBAGEN-1.0.10
    DIR /P

This should show a lot of files, including SBAGEN.EXE.  If you are in
the correct directory, typing `sbagen` should now give a welcome
message and a summary of the command's usage.  If so, everything is
ready.

    sbagen

Thanks to the help of Dirk Cloete, Windows users now have a full set
of tone-set batch files to experiment with, equivalent to the `t-*`
scripts on UNIX and Mac OS X.  These also appear in the same directory
(`*.bat`), along with the sequence files (`prog-*`) and other bits and
pieces.


### Installation for Mac OS X users

From version 1.4.2, Mac OS X users have a DMG file to download which
will hopefully make it much easier to get things working.  This
includes a DEMO command-script that you can double-click to run to get
a quick taster, and a START command-script that sets up Terminal ready
to play sequences.

Note that SBaGen was originally written as a UNIX tool, and it was
adapted to Mac OS X by using CoreAudio for audio output.  For this
reason it uses the text-mode OS X 'Terminal' application as its user
interface.  Versions before 1.4.2 were also distributed as traditional
UNIX TGZ archives.

However, with the DMG archive of version 1.4.2 on, installation should
just be a matter of double-clicking the archive, and dragging things
around.  However, you may still want to read the TGZ installation
instructions below to understand more about how to use sbagen and/or
the command-line.  The new START script should take most of the hassle
out of setting up the command-line, though.


#### Installation of pre-1.4.2 versions for Mac OS X users

For versions before 1.4.2, download the TGZ file for Mac OS X onto
your desktop.  Start up a Terminal (you'll find it under
`Applications/Utilities/Terminal`), and type the commands below.  Remember that you can save time typing by using the Tab key
to expand the filenames as you go (e.g. you can probably type De<TAB>
for "Desktop").  Also, the version number you downloaded will probably
be different to this, so adjust it accordingly:

    tar xvzf Desktop/sbagen-mac-1.0.10.tgz
    cd sbagen-mac-1.0.10

This unpacks the files into a directory `sbagen-mac-1.0.10/` in your
home directory, and moves into that directory.  You can type `l` or
`ls -l` to see all the files.

You also need to make sure that `.` (the current directory) is in your
`$PATH`.  On 10.0 at least, it doesn't seem to be set up by default.  If
you are running csh (which is the default up to 10.2 at least), type
this:

    setenv PATH "${PATH}:."

If you are running zsh or bash, however, type this:

    export PATH="$PATH:."

Now, if you type `sbagen`, you should get a welcome message and a
brief usage message.  If so, then everything is ready.

    sbagen

Note that you will have to do the `cd` and `setenv` every time you
start up a Terminal to run SBaGen.  You can get around this by editing
startup files and so on, but that is too much for me to explain here.

For those new to the UNIX command-line, here are a few basic commands
you will need.  I can't give you more than a taste here -- you'll need
to read up on this elsewhere if you need to know more.

Copying, moving and deleting files is done as follows:

    cp old-file new-file
    mv old-file new-file
    rm file

You can view files using the `less` command.  For example:

    less sbagen.c

Use `q` to quit and arrow keys to move around.  Other useful keys
include `space`, `return`, `d`, `g` and `G`.  (Use `man less` for full
docs).  Don't be afraid to look inside things -- `less` will warn you
if you are trying to look at a binary file.  Remember that this is
UNIX -- you are supposed to be curious and poke around and try and
figure out how things work.  For instance, most of the `t-*` and `prog-*`
files have extra information in the comments that you would not see
otherwise.

You can edit files using `emacs`, which is a very powerful editor.
For simple use, run it like this:

    emacs t-alpha

Move around within the editor using arrows, `^A` and `^E`, save using `^X^S`
and exit using `^X^C`.  If you want more info on this editor, type `^H` or
`^H` `i`, or do a search on the 'net.

Remember that most non-interactive UNIX commands (including SBaGen)
and some interactive ones can be aborted using `^C` (Ctrl-C).  This is
the best way to stop SBaGen once it is running.

Also, on Mac OS X, you may wish to turn the volume up in the System
Preferences.  However, if you turn it up *too* high in early OS X
versions, the audio may start to distort (it will sound rougher), so
watch out.


### Installation for Linux and other UNIX users  

Download the TGZ and unpack it somewhere.  On Linux, the executable
can be built using the little `mk` script:

    ./mk

This script assumes GCC on Linux.  If you're using something else,
please check the script and adjust it as necessary.  There is also a
script `mk-ansi` which strips out non-ANSI C stuff before compiling,
which may work if you don't have GCC.  A user has provided `mk-netbsd`
to build on NetBSD.  The other `mk-*` scripts cover other
possibilities and other platforms -- see the comments in the files for
more details.

If you want Ogg and/or MP3 support, and the pre-built .a files aren't
any good to you, you'll need to rebuild them yourself.  See
`mk-tremor-linux` and `mk-libmad-linux`, which include some
instructions at the top of those files.  On UNIX in general this
should be fairly straightforward -- just be happy that you're not
trying to build this on Windows!

On UNIX systems the code handles output to a stereo `/dev/dsp` device
using either 16-bit signed or 8-bit unsigned samples, or to standard
output, or to a WAV or raw file.

Regarding minimum processor requirements, a Pentium-75 can easily
handle 8 channels of 16-bit 44100Hz binaural beat output.  OGG or MP3
decoding obviously requires more processor power, though.  All the
most time-critical parts use integers only (including Ogg and MP3
decoding), so the code should be relatively easily portable to ARM or
whatever, although I haven't tried this.

Note that the `nice` or `renice` commands may be used as root to give
sbagen a greater priority if output gets choppy on low-spec machines.
In any case, you may want to permanently install the `sbagen` binary
by copying it to `/usr/local/bin/`.  It needs no support files to run.

Once built, you can test the utility quickly by using any of the `*.sbg`
files as an argument to sbagen.  There are also some shell-scripts
(`t-*`) that take you through certain sets of tone-sets, and some
perl-scripts (`p-*`) which generate and run sequences.


## Invocation (all platforms)

One quick thing to note before we start -- remember to play these
binaural beats at low levels, especially when using headphones as
recommended.  You can mix them with a louder soundtrack or pink noise
so that the brain has something louder to keep its attention on.  The
binaural beats can be just-audible in the mix -- that is enough.  With
speakers, the effect is not so strong, so the binaural beats can be
louder, but don't overdo it -- my experience was that playing them
loud didn't improve the effect at all, it just gave me a headache.

So, here we go.  The following example commands should be typed at the
shell prompt provided by your operating system, prepared as explained
above.

    sbagen

This gives a brief usage information.
 
    sbagen -h

This gives the full usage information, showing the version number and
the full list of options.  Check this for any new features.
 
    sbagen prog-chakras-1.sbg

This runs the sequence in file `prog-chakras-1.sbg`, starting playing
whatever should be playing at the current moment, according to the
clock time.  The status-line at the bottom of the screen shows the
current time, and currently-playing tones/noise.  The two lines
immediately above show the period of the sequence which is being
played -- these lines scroll up the screen as one period moves into
the next.

Remember that you can stop the utility using Ctrl-C on all platforms:
Windows, Mac OS X and UNIX.  (Most UNIX users already know this, but
it seems that many Windows users don't know about this standard DOS
key combination).

    sbagen -p drop 00ds+

This runs one of the built-in pre-defined sequences called "drop" with
the given parameters (see later for an explanation).

    sbagen -m river1.ogg -p drop 00ds+ mix/99

This runs the same sequence, but mixes it with water sounds from the
loopable OGG file river1.ogg.

    sbagen -m river2.ogg -p slide 200+10/1 mix/99

This runs another built-in pre-defined sequence and mixes it with
other river sounds.  This particular sequence keeps you in alpha for a
half-hour session whilst dropping the carrier right down to zero.

To test a sequence (without waiting the full 24 hours for it to play
through), run with the `-q` 'quick' option:

    sbagen -q 120 prog-chakras-1.sbg

This example runs the sequence at 120 times the normal speed.  This is
quite useful to check that a new sequence is going to do what you
expect it to do.

To check that SBaGen has interpreted your sequence-file correctly, use
the `-D` option, which dumps a listing of the interpreted sequence
instead of playing it:

    sbagen -D prog-chakras-1.sbg

To quickly test a particular tone-set continuously, use the `-i`
immediate option.  This is good for experimenting with different
ideas.  If your shell lets you recall the previous command with
up-arrow, you can quickly test and fine-tune a tone-set in this way
before putting it into a sequence:

    sbagen -i pink/40 100+1.5/20 200-4/36 400+8/2

This incidentally, is an example of a complex brain-state built from
pink noise, to which is added three frequencies (1.5Hz, 4Hz and 8Hz)
each on an independant carrier (100, 200 and 400 Hz), at different
amplitudes (20, 36 and 2).  This combination is supposedly something
like "body-asleep, brain-awake", assuming I've reproduced it
correctly.

While you're at it, try the alternate `spin` effect.  Not everyone
likes this, but in any case it's there if you want to use it:

    sbagen -i spin:300+4.2/80

If you're having trouble with your soundcard or CPU usage on a very
old machine, use the `-r` or `-b` options to run at a lower output rate or
bit-width.  For example:

    sbagen -r 8000 -i pink/40 100+1.5/20 200+6/30
    sbagen -b 8 -i pink/40 100+1.5/20 200+6/30


For UNIX and Mac OS X, you'll find that there are a set of short
tone-set scripts (`t-*`) that you can run from the command-line.  For
example:

    ls t-*
    t-alpha

All these executable tone-set scripts (`t-*`) accept additional options
and pass them onto SBaGen, so you can use the same options (e.g. `-r`
and `-b`) with these as well.

Try out some of these scripts/batch files to get an idea of some of
the possibilities.


For all platforms (UNIX, Windows and Mac OS X), the sequence files
(`prog-*`) can be used in the same way:

    sbagen prog-NSDWS-example.sbg

Have a play with these sequences.  Some of them are designed to run at
night, so you will hear nothing if you play them during the day.  You
get around this by playing them immediately using `-q 1`, or `-S` (run
from start):

    sbagen -q 1 prog-NSDWS-example.sbg
    sbagen -S prog-NSDWS-example.sbg

On UNIX and Mac OS X, there are also a few Perl-scripts which you can
run (`p-*`).  These generate a sequence on the fly and then run it.  For
anyone familiar with Perl, this is a good way to generate sequences
that are slightly different each night in a random way.  For example:

    p-nightly-sub-delta 7:30

This generates a night-time sequence in `tmp-prog` with a wake-up time
of 7:30 and runs it.  Naturally you won't hear anything unless it is
already night time.


### Outputting to a pipe or a file

You don't need to read this section if you are only interested in
playing through your soundcard.

If you wish to pipe output on to some other utility, use the `-O`
option.  When this is used, the real time is no longer checked, so you
can output to both real-time devices (such as a mixer daemon), or to a
file or effect utility.  It is assumed that the eventual output device
will use exactly the sampling frequency specified, or otherwise all
the frequencies and timings will be out.

The `-o` option can also be used to output directly to a file.  In both
cases headerless raw data is output (to write a WAV file, see the `-W`
option below).  For example, to pipe to bplay under UNIX, you could
use the following:

    sbagen -r 8000 -O -i 100+0.92/30 200+4.2/15 | bplay -S -s 8000 -b 16

The `-L` option allows a time-limit to be set on the output.  So, for
example, to output 45 minutes of data to a file, and then play it with
bplay, use:

    sbagen -r 8000 -o out.raw -L 0:45 -i 100+0.92/30 200+4.2/15
    bplay -S -s 8000 -b 16 out.raw

As an alternative to using `-L`, it is possible to use `-S` and `-E` to
indicate that the output starts at the start of the sequence file
rather than the real time (`-S`), and/or ends at the end of the sequence
file rather than going on forever (`-E`).  Together (`-SE`) the sequence
runs from start to end.  It is also possible to start at a particular
clock time using the `-T` option.

A WAV file can be output using the `-W` option if one of the above
options (`-L` or `-SE`) is also used to fix the length.  The `-W` option
should be used in conjunction with `-o` or `-O`.  So, repeating the
examples above using WAV files, we have:

    sbagen -r 8000 -WO -L 1:00 -i 100+0.92/30 200+4.2/15 | bplay

and:

    sbagen -r 8000 -Wo out.wav -L 0:45 -i 100+0.92/30 200+4.2/15
    bplay out.wav

The `-Q` option may be useful to turn off the information that the
utility normally writes to the screen.

If you are using another utility (perl or whatever) to generate the
sequence-file, you can pipe it directly to the utility, and use `-` as
the filename.  For example:

    cat prog-chakras-1.sbg | sbagen -

For those pushing the utility past its design limits, you may wish to
use the following options: 

`-R rate` specifies the rate at which the sound parameters are
recalculated in Hz, the default being 10Hz.  10Hz is fine for a slide
that takes a minute, but if you are doing quick (1 sec) fades in and
out, you'll need a faster refresh to avoid clicks.

`-F fade_interval` specifies the time in ms over which a fade in or
out takes place.  This is normally one minute (60000ms), which is fine
for slowly changing tone-sets, but you may wish to adjust this value
according to your needs.


### Mixing in background sounds

There are two options to allow you to mix in a background soundtrack
with the binaurals as they are generated.  This is generally regarded
as a good idea, and this technique is used by both CenterPointe and
the Monroe Institute.  The binaural beats are generated at a low level
(e.g. `200+4/1.0`), so that they are only just audible when mixed with
the louder soundtrack (of water sounds or whatever).

The soundtrack should be either in the form of an MP3 file, an OGG
file, a 16-bit stereo WAV file, or raw 16-bit little-endian stereo
audio file.  By specifying the `-m` option, the given file is mixed with
the generated binaural beats:

    sbagen -m background.wav -i 200+4/1

or
 
    sbagen -m river1.ogg -i 200+4/1

When the soundtrack file ends, sbagen will stop playing.  For loopable
OGGs, though (see later), the soundtrack goes on forever.  By default
sbagen will change its sample rate to match the given WAV, MP3 or OGG
file, unless you override it with a `-r` option.  (Note that in the Mac
OS X version of SBaGen 1.2.0, I still haven't added the CoreAudio
sample-rate conversion, so you always end up with the default output
rate at the moment; let me know if this needs fixing urgently).

Note that if the soundtrack is too loud, then the addition of the
binaural beats might cause clipping.  However, you can reduce the
amplitude of the soundtrack using "mix" to fit within the maximum
total limit of 100.  For example:

    sbagen -m soundtrack.mp3 -i mix/99 200+4/1

"Mix" entries may also be used in sequence files to fade the
soundtrack in and out.

The `-M` option allows raw sound data to be passed on the standard
input.  This is useful in combination with other tools that generate
audio.  For example, you can use `splay` on UNIX as an external MP3
player instead of using the built-in one, for example:

    splay -d - background.mp3 | sbagen -M -i mix/99 200+4/1

Piping data in like this has the advantage of not requiring a huge WAV
file to be stored on your disk.


### Standard background sounds

SBaGen comes with two standard OGG files that loop themselves
endlessly in a random way that provides an endless stream of river
sounds with no discernable pattern.  These are used with the `-m`
option.  For example:

    sbagen -m river1.ogg -i 200+10/1
    sbagen -m river1.ogg#1 -i 200+10/1
    sbagen -m river2.ogg -i 200+10/1
    sbagen -m river2.ogg#1 -i 200+10/1

The `#1` part allows you to select different looping setups from the
file.  Each file may have several looping setups, on `#0` (the default),
`#1`, `#2` and so on.  Adding a `mix` spec allows you to control the
volume level, for example:

    sbagen -m river1.ogg -i 200+10/1 mix/50

Please note that these sound files are released under the Creative
Commons [Attribution-ShareAlike licence]( http://creativecommons.org/licenses/by-sa/1.0/).

If you want to make commercial use of these river sounds (e.g. a tape
or CD to sell), then you must allow other people to freely copy and
modify your finished work, and you must let them know that they have
the right to do so.  See the Creative Commons pages for more details.
However, possibly other licensing arrangements could be arranged if
you contact me.


### Creating loopable OGGs

This section will be of interest only to those people who want to
create special loopable OGG files to use with SBaGen, like the
provided river1.ogg and river2.ogg files.

The cross-fading and looping settings for any particular OGG file are
controlled by a spec-string embedded in the file with the tag
"SBAGEN_LOOPER".  This may be set using the standard OGG
'vorbiscomment' tool, for example:

    vorbiscomment -a in.ogg out.ogg -t "SBAGEN_LOOPER=s4-16 f0.2" 

The tag contains entries as follows, optionally separated by white
space:

    s<dur>        Set segment size to given duration in seconds
    s<min>-<max>  Set segment size to randomly vary within given range
    f<dur>        Set duration for cross-fades
    c<cnt>        Number of channels: 1 or 2
    w<bool>       Swap stereo on second channel? 0 no, or 1 yes
    d<min>-<max>  Select section of OGG file data to use as source audio
    #<digits>     Following settings apply only to one section

The default is something like `s99999999 f1 c1 w1 d0-99999999`,
i.e. segments are the full length of the audio, taken out of the whole
of the audio file, repeated forever with a 1 second cross-fade at
start/end.

Note that with `c1`, only one audio segment is playing at any one time
(except for those moments when there is a cross-fade taking place from
one segment to the next).  However, with `c2`, two segments will be
playing constantly.  This means that if `c1` sounds like a small
river, `c2` will sound like a big river!  By default the second
playback channel has left and right swapped over, so that the sound is
always balanced; `w0` makes it unswapped.

The scheduling required to select random segments of audio that won't
interfere with one another or repeat anything already heard recently
is quite complex, but it should all work without problem so long as
the maximum segment size is no more than around 25% of the total
length of the OGG file.  If the maximum segment size is longer, then
everything will still work, but there is a very small chance that you
may get 'echo' effects at times (e.g. when the same segment is played
on both channels at nearly the same time).

The # part of the spec-string works as follows.  The .ogg filename on
the command line may be followed by `#<digits>`.  If this is missing, it
is equivalent to `#0`.  This allows different groups of settings to be
selected out of the `SBAGEN_LOOPER` string.  As an example (spaced to
make it more readable):

    SBAGEN_LOOPER=s4-16  #0 f0.2  #1 f0.5  #2 f1

The initial part is read in all cases, and then `#0`, `#1` and `#2` can be
used to select different cross-fade times.


#### Using ReplayGain with OGG files

SBaGen supports ReplayGain tags in the OGG header.  What this means is
that if you run `vorbisgain` on your OGG file to add this tag, your
OGG file should come out sounding around about the same loudness level
as everyone else's OGG files (including river1.ogg and river2.ogg).
It does this by recording the necessary volume adjustment in the OGG
header, and then SBaGen picks this up and adjusts the volume level
accordingly.  This makes it easier for people to substitute one OGG
for another in their sequences.  (Thanks to Dylan Carlson for
suggesting this.)


### Compensating for headphone low frequency roll-off

For those who are interested in working with especially low carrier
frequencies, please read this section.  Everyone else can skip it --
you don't need to use this for running most sequences.  It only
becomes useful for later `-p` drop sessions, or if you want to enhance
the effect of `-p` slide.

Your headphones and audio equipment will naturally respond less at
lower frequencies, and how much the amplitude 'rolls off' depends on
many things.  However, SBaGen can compensate for this by increasing
the amplitude of the sine waves it is generating.  All you have to do
is give it a set of frequency/amplitude points, and it does the rest.
The compensation is quite intelligent.  It works on the individual
output frequencies on left and right channels, so if the left channel
has a lower frequency, it will be boosted more.  Also, if increasing
the beat amplitudes would cause other sound sources (such as the mix
stream) to overload the outputs, those sources are reduced in
amplitude.

To set this up, you have to decide how much you want the lower
frequencies boosted by.  If you know something about electronics, you
may be able to measure this, but if not you could try a few
frequencies and adjust the amplitude by ear until they sound okay.
For example, you could try the following:

    sbagen -i 160/1
    sbagen -i 80/1
    sbagen -i 40/1
    sbagen -i 30/1
    sbagen -i 20/1

Now try adjusting the amplitudes of the lower tones to make them
audible in some way.  Don't overdo it, though -- remember your ears
are also becoming less sensitive as the frequencies go down, and you
are only trying to make the tones seem present, not necessary as loud.
Also, you might damage equipment if you boost sub-bass frequencies too
far (watch your speaker cones!).  Once you have a set of specs that
you are happy with (let's say `80/1`, `40/2`, `30/4` and `20/6`), you can put
them into a `-c` specification as follows:
  
    -c 80=1,40=2,30=4,20=6

Note that the highest frequency should always have an adjust of 1,
because this is what will be used for all the frequencies above that.

If you add this to the sbagen command-line, then all sine-waves output
will be adjusted according to this.  All tones with frequencies above
the highest frequency in the list are multiplied by the factor on the
highest, and all below the lowest frequency are multipled by the
factor on the lowest.  The frequencies in between use a factor
established by linear interpolation, so in this case 60Hz gets a
factor of 1.5 from being half-way between 80Hz and 40Hz.  You are not
limited to the frequencies above (80,40,30,20), incidentally -- you
can use any frequencies you like.

In this way, you should be able to make better use of your existing
equipment to reach the lower frequencies.  This is especially
interesting for the later levels of `-p` drop and also for all the `-p`
slide sequences.  However, do remember that your `-c` option applies
only to your own particular soundcard, amplifier and headphones, so
please remove or comment out any `-c` options in any sequences you send
to other people.


### The 'drop' sequences

This is a series of sequences that are designed to be used fairly
often and over a long period of time (e.g. daily over several years).
By working through all these sequences, you stimulate all the
different combinations of carrier frequency and beat frequency over a
large range (0-200Hz carrier, 0.3-10Hz beats).  According to some
people's experiences, doing this releases mental energy for reuse.
You have to work through this over a long period, though, because the
stirred up energy sometimes needs time to be reprocessed by your body.

(For those familiar with Toltec traditions, this is a form of
Recapitulation.  For those familiar with Chi and Taoist practices, you
could say that this stirs up heavy chi for reprocessing and reuse.
Those who have used regression may experience the processing of
stirred up energy as reliving and releasing of past painful or
emotional events.  There are many approaches and interpretations that
can be applied to the same thing.)

For guidelines on how to use this method, start at a particular level,
e.g. level 00, and listen to that level until you get 'bored' of it,
i.e. until it seems to be having no more effect.  Then move onto level
01 and do the same.  If you want to move ahead more quickly, you can
step two levels at a time (there is some overlap between levels), but
working one level at a time is recommended.

There are two main things you may experience at each level:

- A boost of energy, which is generally regarded as a good thing.

- An apparent drop in energy, due to your body working to reprocess
  the old stirred up energy.  If this is mild, keep using the same
  level until it clears, at which point you may get a boost.  However,
  if it seems too much, then stop listening for a while until you feel
  stronger again, and come back to it.  Any other activities that you
  do that enhance your physical or energetic well-being and health
  will help you with working through any particularly difficult
  levels.

If you work too fast through the levels (e.g. listening to too many
different levels in a short space of time without finishing any of
them), you may reach a state of 'overload' or 'overstimulation', with
too much going on in your head or other problems like that.  In this
case, take a rest from the sequences and wait for things to get back
to normal.  Then you can approach them again a little more carefully.

The levels are labelled with two digits (the level number from 00 to
99) and a letter indicating how deep the sequence takes you.  For
example, 00d is a good starting point.  To this you add `s+` to
indicate sliding and an hour-long sequence.  It is best to also mix
these with river sounds, for example:

    sbagen -m river1.ogg -p drop 00ds+ mix/100

If you are doing sessions in the middle of the day, you may want to
add a 'wake-up' at the end using '^', which brings you up to alpha
again at the end:

    sbagen -m river1.ogg -p drop 00ds+^ mix/100

Once you have completed level 00, you can move onto the next (01, 02,
03, etc).  However if you like, instead you can try increasing the
depth of the session.  In 00ds+, the 'd' indicates that it goes down
to 2.5Hz (a delta frequency).  The lightest is `a` (e.g. 00as+), which
only goes down to 4.4Hz (theta), whilst the deepest is `l`, which goes
right down to 0.3Hz (sub-delta).  The aim is to go as far as you can
with both the levels (00-99) and the depth (a-l).  You have to judge
your progress for yourself, though -- trying very deep levels to start
with won't work, because you won't be able to entrain that low without
lots of practice.


#### More detailed notes on `-p drop` options

    Usage: 

      -p drop <digit><digit>[.<digit>...]<a-l>[s|k][+][^][/<amp>] <tone-specs> ...

    Examples:

      -p drop 00a
      -p drop 00ds+
      -p drop 20fs+^/2 mix/98
      -p drop 34.5dk+/1.5 pink/30 

The argument after the `drop` gives the level and depth of the
sequence to run.  The digits 00 to 99 select the level, based on
carrier frequencies from 200Hz (00) down to 2Hz (99).  The idea is to
work from level 00 to 99, waiting for each to become 'boring' before
moving on.  (In theory, the whole set could take several years to work
through.)  Later levels require headphones that can reproduce really
deep bass frequencies, ideally down to 10Hz or lower.  If you want to
fine-tune the level, you can include a decimal point (e.g. 20.5a for
halfway between 20a and 21a).

The letter a-l (or A-L if you prefer) selects the depth of the beat
frequencies.  Beat frequencies always start at 10Hz, and then drop
exponentially to a target, which is as follows for letters A-L: 4.4,
3.7, 3.1, 2.5, 2.0, 1.5, 1.2, 0.9, 0.7, 0.5, 0.4, 0.3.  Using A, you
never get down to delta frequencies.  The deeper beats (i.e. later
letters) are supposed to be better, so long as you really are
entraining to them.  Like the carriers, this is something to build up
over time.

You have three options regarding how the frequencies change during the
session.  By default (00d+) the frequencies go down in steps, changing
every 3 minutes.  With `k` added (`00dk+`) the frequencies go down in
shorter 1 minute steps.  With 's' added (00ds+) there are no steps,
and the frequencies smoothly and gradually change throughout the whole
session, which gives less experience of specifics.  The two stepping
options are interesting because if you get into a dreaming state you
may notice that the dream-scene changes for every step.  It is as if
that scene is somehow attached to those frequencies, and by being held
on the frequencies you go deeper into it.  With a sliding session
(`00ds+`), maybe you never stay long enough on any one frequency to find
the scene, but instead you are gently kept moving though the
frequencies without stopping.  I have been using the sliding option
for my sessions, but some people may like to experiment with the
stepping options.

The basic `drop` through the beat frequencies occurs in the first 30
minutes of the session.  By adding a `+` (`00ds` versus `00ds+`) an extra
30 minutes are added keeping you at the target beat frequency whilst
still continuing to gently drop the carrier.

Normally the sequence fades out at the deepest beat frequency.
However, if you need to get on with your day immediately after doing a
session, you may want to add the `wake-up` option by adding a `^`.
This adds a 3-minute slide back up to the initial frequencies to wake
you up.

The optional `/<amp>` on the end lets you change the amplitude of the
waves if necessary (e.g. `00ds+/2`).  By default, the level is set to 1.

After the spec comes an optional list of normal tone-sets.  These can
be used to add mix sounds (e.g. `mix/100`) or pink noise (`pink/30`) or
other sounds to the beats.  Anything you add here will automatically
be faded in and out at the start and end of the session.


#### Adjusting the length of a `-p drop` session

An optional specification may be added after `-p drop` and before the
drop specification to adjust the length of the `-p drop` session from
the standard of a 30-minute 'drop' part, optional 30-minute hold and
optional 3-minute wake-up.  This is formatted as follows:

    t<drop-time>,<hold-time>,<wake-time>

For example:
 
    t40,10,5

The above example gives a 40-minute drop part, optional 10 minute
hold, and optional 5 minute wake-up.  It might be used as follows:

    sbagen -m river2.ogg -p drop t40,10,5 20ds+^/2 mix/98

This way you can create `-p drop` sessions of whatever length you wish.
Note that lengths are rounded to the nearest minute, and may also be
rounded further if necessary if the session is based on 3-minute
steps.  Also note that you must include the lengths for all three
parts even if you are not using `+` or `^` for a hold or wake-up part.


### The 'slide' sequences

    Usage:

      -p slide [t<duration>] <carr><sign><beat>/<amp> <tone-specs> ...

    Example:

      -p slide 200+10/1
      -p slide t60 200+10/1 mix/100

This provides a series of sequences that hold the beat frequency
constant whilst dropping the carrier tone from the initial value right
down to 0Hz.  This is another way of covering all the combinations of
carrier frequency and beat frequency (as `-p drop` does), but working in
the other direction.  These are also interesting because -- let's say
we use the example of `-p slide 200+10/1` -- in this sequence you are
held at the alpha frequency of 10Hz for the whole session.  People
have reported feeling 'bright and awake' after this kind of session,
because it covers a lot of frequencies, but it doesn't take them too
deep.

If you want a deeper session, though, you could try `200+8/1` or
`200+6/1`.  You could also try working through the beat frequencies in
0.1 or 0.2Hz steps if you want to try this as an alternative to `-p
drop` for working through all the combinations.

The sessions are 30 minutes long by default.  If you want a longer
session, you can add `t<duration>` after the `slide`, for example `-p
slide t60 200+6/1` for a 60 minute session.

Another point is that the lower frequencies will probably not be
audible on your headphones.  This is not a big problem, but if you
want to try and get a little more out of your equipment, you could
experiment with the `-c amplitude-compensation` option (see the section
above).


## Writing sequence files

If you decide you would like to create your own sequences, then you
need to learn how to write a sequence file.  Probably the easiest way
of starting is by looking at existing sequence files (the `prog-*`
files), and then take a copy of one that seems close and then modify
it until it does what you want.  For example, `prog-tape-3.sbg` is a
good example of a sequence that gently slides between several
brainwave frequencies using a single binaural tone.

For Windows users, you can edit these files using EDIT or NotePad (or
any simple text editor).  Mac users will have to use an editor that
respects UNIX line-endings (e.g. `emacs`, BBEdit, or whatever).


### The sequence-file format

Within the sequence file, blank lines, and any leading/trailing white
space are ignored.  Comments are introduced with a `#`, and extend to
the end of the line.

Comments starting with two hashes `##` are special because they are
printed out when the sequence is run.  They can be used to include a
description of the sequence (or credits or whatever) that is visible
to users of the sequence.

Apart from comments and blank lines, there are several types of
entries that may appear in the file:

  * Command-line options
  * Tone-set definition lines
  * Time-sequence lines
  * Block definition lines

These are described below.  Take a look at the example sequence-files
(`prog-*`).  They are useful to see how all these work together.


#### Command-line options within the sequence file

All of the command-line options reported by `sbagen -h` can also be
included in sequence files.  They should appear at the top, before any
tone-sets or whatever.  The purpose of these options are to permit
soundtracks to be specified, and to indicate whether the sequence is a
24-hour sequence or an on-demand sequence.

Some of the options that are useful inside a sequence-file are as
follows:

    -Q        Quiet - don't display running status
    -S        Output from the first tone-set time in the sequence (Start),
             instead of running according to the clock
    -E        Output until the last tone-set in the sequence (End),
             instead of outputting forever
    -T time   Start at the given clock-time (hh:mm)
    -L time   Select the length of time (hh:mm or hh:mm:ss) to output for
    -m file   Read audio data from the given file and mix it with the
              generated binaural beats; may be ogg/mp3/wav/raw format
    -i ...    Generate the whole sequence from an 'immediate' spec
    -p ...    Generate the whole sequence from a prodefined sequence type,
              e.g. -p drop or -p slide

The option and its arguments must appear on a line together, and
several options may be put on one line if you wish, or they may be
spread over several lines.

For example, it is common to use `-SE` to indicate a sequence that runs
from start to end and then stops:

    -SE

To mix with a particular background soundtrack, use `-m`:

    -m soundtrack.mp3

Note that if the user runs sbagen with another `-m` option, the user's
command-line option overrides the one in the sequence file.

To run for 30 minutes from the clock-time of 2pm in the sequence file,
try this:

    -L 0:30 -T 14:00


#### Tone-set definition lines

The purpose of this is to describe a set of binaural tones, pink noise
or whatever which are played together at any one time.  Once they are
defined, you can slide from one to the next, or fade them in and out
in the following section.

A tone-set definition line takes the form:

    <name>: <tone-spec> <tone-spec> ...

Examples:

    theta6: pink/40 150+6/30
    test10: pink/40 100+1.5/30 200-4/27 400+8/1.5
    all-off: -

The name starts with a letter, and may continue with letters, numbers,
`_` or `-`.  Following the colon is a list of one or more tone
specifications.  There are a maximum of 16 of these.  (This can be
adjusted in the source code -- search for `N_CH`).

Here are the different types:

    -                             # Channel not in use
    pink/<amp>                    # Pink noise
    mix/<amp>                     # Soundtrack input mix
    <carrier><sign><freq>/<amp>   # Binaural tones
    <carrier>/<amp>		# Sine-wave (a binaural tone with 0Hz beat)
    bell+<freq>/<amp>             # Bell sound
    spin:<width>+<freq>/<amp>     # Spinning variable-delay pink noise
    wave<num>:<carrier><sign><freq>/<amp>
                                # Binaural tones using a user-defined 
                                # waveform (*EXPERIMENTAL*, see later)

The amplitudes are expressed on a scale 0-100.  The total of all the
amplitudes `<amp>` in a tone-set should not exceed 100, or else there
will be distortion on output as the waveforms are clipped.

The binaural tones are based on a carrier frequency (in Hz), which
should typically be in the range 50 to 1000.  Frequencies above
1000-1500 or so are of no use because the brain does not react to
higher pitches binaurally in the same way (see the Monroe Institute
pages).  You can go down to 50Hz and below if you like, but make sure
that your headphones actually go that low first.  The actual beat
frequency `<freq>` (which the brain responds to) should typically be in
the range 0.5 to 30 Hz.  This corresponds to the ranges for Delta up
to Beta as described above.

The two tones generated are different by `<freq>`Hz, equally spaced
either side of `<carrier>`.  The `<sign>` should be `+` or `-`, and this
decides which channel carries the higher frequency.  I don't think
this matters, but in case it does, you can change it here.  So, for
example, `100+4/20` generates tones of 102 and 98 Hz, whereas `100-4/20`
generates tones of 98 and 102 Hz.

The `bell` sound can be used to give cues and signals during the
sequence.  A simple 'ping' is generated at the given frequency at
the start of the period in which the tone-set is used.

The spinning pink noise generates a binaural effect in a completely
different way to binaural tones, by shifting the delay of pink noise
in opposite directions for each ear, at a given beat frequency.  In
this case, the first number is the width of the maximum delay from
centre in microseconds.  Values from 100 to 500 seem good to me,
although you might want to experiment with this.  The second number is
the beat frequency and the third is the amplitude, as above.

Binaural tones generated using `wave<num>` work just the same way as
normal binaural tones.  See the section later on for details.

Once a tone-set has been defined, it may be used in time-sequence
lines.


#### Time-sequence lines

Whereas the tone-set lines describe the different sets of tones that
should be played, the time-sequence lines describe *when* they should
be played, and how sbagen should move between them.

A time-sequence line takes one of the two forms:

    <time-spec> [<fade-in-fade-out>] <tone-set-name> [->]
    <time-spec> <block-name>

Examples:
  
    16:00 theta6
    NOW theta6
    +00:03:30 == theta4 ->
    NOW+04:00 <> theta4
    12:00 theta-bursts

In it's simplest form, this specifies a clock time, and which tone-set
should be played at that time.  This tone-set continues until the next
clock-time that is specified.

Time-sequence lines should always appear in order -- you will get an
error if things appear out of order.

More complex examples give time relative to the time that sbagen
started running (`NOW`, or `NOW+04:00`), or relative to the last absolute
time mentioned (`+00:03:30`).  They also use different varieties of
fade-in or fade-out (`==` or `<>`), and use `->` to slide to the next
time-sequence.  You can also name [blocks](#block-definition-lines)
instead of tone-sets.  These more complex options are described below.

Take a simple example such as this one:
  
    11:00 theta6
    12:00 alpha8
    13:00 alpha10
    14:00 off

This indicates three tone-sets that will play for an hour each between
11am and 2pm.  The tone-sets do not change suddenly on the hour.
Rather, sbagen starts to fade out one tone-set 30 secs before the
hour, fading in the next for the first 30 secs of the next hour.

By default, sbagen will attempt to keep common things playing from one
tone-set to the next.  So if, for example, all of them use pink noise
on the first channel, then this will keep on playing the whole time,
whilst the tones that change will fade out and in.

To change the fading in/out behaviour, include a `fade-in-fade-out`
specification before the name.  This consists of two characters, one
for fading in this tone-set, the second for fading it out.  The
fade-in character may be:

    <   Always fade in from silence.

    -   Fade from previous to this, fading out all tones not
        continuing, fading in all new tones, and adjusting the
        amplitude of any tones continuing.

    =   Slide from previous to this, fading out all tones ending,
        fading in all new tones, and sliding the frequency and
        adjusting the amplitude of all other tones.

As an example, using `=` you can smoothly slide from a 4 Hz frequency
all the way up to a 12 Hz frequency, rather than fading one out, and
fading a new one in.  The fade-out characters are similar, and may be:

    >      Fade out to silence
    -      Fade to next, as above
    =      Slide to next, as above

What fades/slides actually occur between two tone-sets depends on what
both of them are asking for.  If one wants to fade out to silence,
then the other one can't slide to it.  They both have to want to slide
for this to occur.

The default `fade-in-fade-out` specification is `--`, which means keep
playing anything that is the same frequency (adjusting the amplitude
if necessary), but fade everything else in or out.

By default fading and sliding only occur during the 60 second period
within 30 seconds either side of the change-over time.  However, using
`->`, the entire period from the start time to the time on the next
time-sequence line becomes a transition period.  This way you can have
a gentle frequency slide that goes on for an hour, if you like:

    15:00 == theta4 ->
    16:00 == alpha10

Assuming these tone-sets do what their names suggest, this will
produce a gentle change in binaural beat frequency from 4Hz up to 10Hz
over the hour from 3pm to 4pm.

The time-specification in its simplest form may be in the form `hh:mm`
or `hh:mm:ss`.  This counts as an absolute time.

Another form of time-specification is `NOW` which indicates the time
at which sbagen was started.  This is useful for sequence-files that
are intended to play from the time that they are run, rather than
always at the same time of day.  `NOW` is another absolute time.

The other form of time-spec is a relative time, either `+hh:mm` or
`+hh:mm:ss`.  This, if used alone, is taken relative to the
last-mentioned absolute time, for example the three relative times
below are all relative to `NOW`, the last-mentioned absolute time:

    NOW+00:10 theta4
    +00:20    off
    +00:30    theta4
    +00:40    off

Any number of relative times may also be used with an absolute time,
to modify it, for example `NOW+04:00+01:12:04` or `12:00+00:00:20`.


#### Block definition lines

This introduces a set of lines, which can then be later used like a
'rubber stamp' to repeat the same set of lines at specific times
throughout the sequence.  This takes the form:

    <block-name>: {
        <time-sequence-line>
        ::
    }

For example:

    theta-bursts: {
        +00:00 theta4
        +00:05 off
        +00:10 theta4
        +00:15 off
    }

A block definition associates a name with a group of time-sequence
lines.  All the time-specs on these lines should be relative, because
when the block is called on, all the times will be combined with the
time-spec from the calling line.

For example, using the above definition:

    NOW theta-bursts

expands to:

    NOW+00:00 theta4
    NOW+00:05 off
    NOW+00:10 theta4
    NOW+00:15 off

Or for another example:

    +01:00 theta-bursts

expands to:

    +01:00+00:00 theta4
    +01:00+00:05 off
    +01:00+00:10 theta4
    +01:00+00:15 off

You can also use block-names within other blocks.  For example:

    two-burst-sets: {
        +0:00 theta-bursts
        +1:00 theta-bursts
    }

Saying:

    NOW two-burst-sets

expands to:

    NOW+0:00 theta-bursts
    NOW+1:00 theta-bursts

which expands to:  

    NOW+0:00+00:00 theta4
    NOW+0:00+00:05 off
    NOW+0:00+00:10 theta4
    NOW+0:00+00:15 off
    NOW+1:00+00:00 theta4
    NOW+1:00+00:05 off
    NOW+1:00+00:10 theta4
    NOW+1:00+00:15 off

By putting little sequences into blocks like this, it makes it easier
to later build up a sequence from fixed parts.


### Multiple sequence files

If multiple files are specified on the command-line, then they are all
loaded together as a single sequence.  This may be useful if you want
to keep tone-set and block definitions separate from the sequences
themselves.

Note that putting two different full sequences together typically
won't work unless they were designed to work together.


## Conclusion

Hopefully this should be enough information to allow you to design and
write your own sequences now.  Playing around with the example
sequences (the `prog-*` files) will also help.

Happy experimenting!!



## Appendix-A: User-defined waveforms

This was a bright idea I had at one point in the distant past, but it
never worked out.  Some day I think I will cut it out of SBaGen and
out of these docs, but for now at least it is still here:
 
This is a more complex form of binaural synthesis (maybe too complex!), 
and right at this moment, I'm not sure whether it really works or not
either, so this section is only for die-hard (b)leading-edge hackers
and experimenters.  The code is in place to do this synthesis, but it
doesn't seem to work right.  If you're still interested, read on ...

The purest form of binaural beat synthesis is based on two sine waves
of slightly differing frequency.  The interference between these two
within the brain generates a resultant wave with a slow modulation.
Assuming the interference within the brain is similar to normal wave
interference, then the resultant amplitude wave is shaped by what
looks like a full-wave rectified sine wave (like the +ve half of a
sine wave repeated endlessly).

There is a line of thinking that suggests that if we replace this
amplitude envelope with one based on the shape of a measured
brain-wave, then we should be able to reproduce that brain-wave in the
brain -- i.e. we play a measured alpha wave to entrain the brain
precisely to an alpha wave.  Does this work?  I really don't know.

This is how it is used in the sequence-file.  You provide the shape of
the brain-wave to the program in a waveform definition line:

    wave<2-digits>: <list of samples>

There can be at most 100 waveforms defined in a sequence, numbered 00
to 99.  For example:

    wave00: 0 5.5 10 8 10 7.2 4.7 2 

The samples are values from the waveform shape taken at regular
intervals over one cycle.  They can be in any units you wish --
floating point numbers, negative, whatever -- and there may be as many
samples as you wish (currently only limited by line length).  They
will be rescaled to fit between the amplitudes of 0% and 100% and
smoothed using a sin(x)/x function.  See [here](http://www-ccrma.stanford.edu/~jos/resample/) for more details on the
smoothing used.


This waveform now becomes the amplitude envelope of any binaural tones
generated from it:

    wave00:200+4/50

This is just the same as `200+4/50`, except it uses the new waveform for
the amplitude envelope.

That's all you need to know to be able to use it.  All you have to do
now (according to the theory, at least) is to go and measure some
waveforms -- off the 'net if like most of us you don't have an EEG --
feed them into waveNN: lines, and then play them at appropriate
beat-frequencies.

Well, that's the theory, but not everything seems to be working
according to plan from my experiments.  Here is the basis on which the
code works to generate the tones:

If you take the 0-100% scaled and smoothed amplitude waveform, and
draw it twice, and invert the second version, you have a wave that can
be played at audio frequencies.  If you play this in the left ear at
102Hz (for example), and in the right ear you play the same thing at
98Hz BUT WITH THE SAMPLE REVERSED, then in theory you should get the
correct amplitude envelope.  Here is the mathematical basis for this
(from the mailing list):

> Let's say we have a brain-wave waveform of f(T) (T is theta),
> expressed as a fourier series (using complex maths because it's
> easier):
> 
>     f(T) = sigma(n= -inf to +inf) ( Cn . e^(inT) )
> 
> What we want to end up with is a resultant function something like
> this:
> 
>     g(t) = sigma(n= -inf to +inf) ( Cn . e^(inbt) . 2 cos nat )
> 
> where 'a' is the resultant carrier frequency (in rad/s here), and 'b'
> is the beat frequency.  This means that the phase information is
> connected with the beat waveform, and the phase of the carriers are
> fixed.  The factor 2 comes in handy lower down:
> 
>     g(t) = sigma(n= -inf to +inf) ( Cn . e^(inbt) . (e^(inat) + e^(-inat)) )
> 
>     g(t) = sigma(n= -inf to +inf) ( Cn . e^(in(b+a)t) + Cn . e^(in(b-a)t) )
> 
>     g(t) = f((b+a)t) + f((b-a)t)
> 
> So we just need to play the original waveform at frequencies (b+a) and
> (b-a).  But 'b' will typically be small (1-30Hz), and 'a' will be
> large (100-1500Hz).  So (b-a) is negative, which means playing the
> sample backwards.
> 
> So if we play the required brainwave forwards at the higher
> frequency, and backwards at the lower frequency, it should all come
> out with what we want.

However, with my experiments I don't get the expected resultant
amplitude envelope.  I get bits of it, but not a perfect result.
What's going on, I don't know.  Anyway, if you're up for experimenting
with this, at least the code is there now for you to play with and
modify.  If you make any progress, let me have the improved code, and
I'll include it in the next release.