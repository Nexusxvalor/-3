// // This file reads the text configuration and provides it to the app

// export const textConfig = {
//   greeting: {
//     name: "Heyy, KuchuPuchu!",
//     message: "Click on the message to view my letter"
//   },

//   letter: {
//     title: "Read My Letter",
//     subtitle: "Click to see your special letter",
//     recipient: "Dear Kuchupuchu",
    
//     paragraphs: [
//       "I wanted to make something special for you...",
//       "So, here is a gift for you.",
//       "It’s not just a simple gift, but a piece of my heart wrapped in code and creativity.",
//       "Every animation, every detail, every word, made just for you.",
//       "I hope this little surprise brings a smile to your face, just like you always bring to mine."
//     ],

//     signature: "Yours sincerely,\nMadam Ji"
//   },

//   gallery: {
//     title: "Some Special Moments",
//     subtitle: "Swipe to see more ✨",
//     photos: [
//       { src: "./images/pic1.gif", caption: "Our sweet moment together 💕" },
//       { src: "./images/pic2.gif", caption: "Always making me smile 😊" },
//       { src: "./images/pic3.jpg", caption: "Perfect day with you ✨" }
//     ],
//     scrollIndicators: 3, // number of dots
//     dividerIcon: "📷"
//   },

//   game: {
//     title: "Play a Game!",
//     subtitle: "Catch some hearts to unlock a special message",
//     completionMessage: "You've completed the game! ✨ But you can play again if you want!",
//     winMessage: "You caught my heart! Just like how you've captured my real heart forever..."
//   },

//   ui: {
//     envelopeHint: "Click to open",
//     envelopePreview: "💌 A letter for you..."
//   },
// };


// src/textConfig.ts
export const textConfig = {
  greeting: {
    name: "Heyy, KuchuPuchu!",
    message: "Click on the message to view my letter"
  },

  letter: {
    title: "Read My Letter",
    subtitle: "Click to see your special letter",
    recipient: "Dear Kuchupuchu",

    paragraphs: [
      "I wanted to make something special for you...",
      "I hope this little surprise brings a smile to your face, just like you always bring to mine."
    ],

    signature: "Yours sincerely,\nMadam Ji"
  },

  gallery: {
    title: "Some Special Moments",
    subtitle: "Swipe to see more ✨",
    photos: [
      { src: "./images/pic1.gif", caption: "Thanks for always being there💕" },
      { src: "./images/pic2.gif", caption: "Always making me smile 😊" },
      { src: "./images/pic3.jpg", caption: "Hehe✨" }
    ],
    scrollIndicators: 3,
    dividerIcon: "📷"
  },

  playlist: {
    title: "Playlist For You",
    subtitle: "Dedicated to you 💖",
    songs: [
      {
        title: "Dil Cheeze Tujhe Dedi ",
        info: "🤌",
        src: "./music/music1.mp3",
        cover: "./musiccover/music1.jpg"
      },
      {
        title: "If The World Was Ending",
        info: "😁",
        src: "./music/music2.mp3",
        cover: "./musiccover/music2.jpg"
      },
      {
        title: "Dil Ka Jo Haal Hai",
        info: "🙂",
        src: "./music/music3.mp3",
        cover: "./musiccover/music3.jpg"
      }
    ],
    dividerIcon: "🎧"
  },

  game: {
    title: "Play a Game!",
    subtitle: "Catch some hearts to unlock a special message",
  },

  ui: {
    envelopeHint: "Click to open",
    envelopePreview: "💌 A letter for you..."
  }
};
