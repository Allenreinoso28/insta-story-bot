require("dotenv").config();
const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
// import { StickerBuilder } from '../src/sticker-builder';


const postToInsta = async () => {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

    const imageBuffer = await get({
        url: 'https://pic1.mangapicgallery.com/r/album/bb/md_/549424_5087923.jpg',
        encoding: null, 
    });

    // await ig.publish.photo({
    //     file: imageBuffer,
    //     caption: 'playing around with some code rn', // nice caption (optional)
    // });

    await ig.publish.story({
        file: imageBuffer
        // // this creates a new config
        // stickerConfig: new StickerBuilder()
        //   // these are all supported stickers
        //   .add(
        //     StickerBuilder.hashtag({
        //       tagName: 'insta',
        //     }).center(),
        //   )
        //   .add(
        //     StickerBuilder.mention({
        //       userId: ig.state.cookieUserId,
        //     }).center(),
        //   )
        //   .add(
        //     StickerBuilder.question({
        //       question: 'My Question',
        //     }).scale(0.5),
        //   )
        //   .add(
        //     StickerBuilder.question({
        //       question: 'Music?',
        //       questionType: 'music',
        //     }),
        //   )
        //   .add(
        //     StickerBuilder.countdown({
        //       text: 'My Countdown',
        //       // @ts-ignore
        //       endTs: DateTime.local().plus(Duration.fromObject({ hours: 1 })), // countdown finishes in 1h
        //     }),
        //   )
        //   .add(
        //     StickerBuilder.chat({
        //       text: 'Chat name',
        //     }),
        //   )
        //   .add(
        //     StickerBuilder.location({
        //       locationId: (await ig.locationSearch.index(13, 37)).venues[0].external_id,
        //     }),
        //   )
        //   .add(
        //     StickerBuilder.poll({
        //       question: 'Question',
        //       tallies: [{ text: 'Left' }, { text: 'Right' }],
        //     }),
        //   )
        //   .add(
        //     StickerBuilder.quiz({
        //       question: 'Question',
        //       options: ['0', '1', '2', '3'],
        //       correctAnswer: 1,
        //     }),
        //   )
        //   .add(
        //     StickerBuilder.slider({
        //       question: 'Question',
        //       emoji: '❤',
        //     }),
        //   )
    
        //   // mention the first story item
        //   .add(StickerBuilder.mentionReel((await ig.feed.userStory('username').items())[0]).center())
    
        //   // mention the first media on your timeline
        //   .add(StickerBuilder.attachmentFromMedia((await ig.feed.timeline().items())[0]).center())
    
        //   // you can also set different values for the position and dimensions
        //   .add(
        //     StickerBuilder.hashtag({
        //       tagName: 'insta',
        //       width: 0.5,
        //       height: 0.5,
        //       x: 0.5,
        //       y: 0.5,
        //     }),
        //   )
        //   .build(),
      });
}


postToInsta();