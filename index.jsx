require("dotenv").config();
const { IgApiClient } = require('instagram-private-api');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Promisify fs.readFile
const readFileAsync = promisify(fs.readFile);

// Function to fetch a random quote
async function getRandomQuote() {
    try {
        const response = await axios.get('https://api.quotable.io/random');
        return {
            quote: response.data.content,
            author: response.data.author
        };
    } catch (error) {
        console.error('Error fetching quote:', error);
        throw error;
    }
}

// Function to wrap text to fit within a specified width
function wrapText(ctx, text, x, y, maxWidth, lineHeight, align = 'left') {
    let words = text.split(' ');
    let line = '';
    let lines = [];

    words.forEach((word) => {
        let testLine = line + word + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;

        if (testWidth > maxWidth && line !== '') {
            lines.push(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    });

    lines.push(line);

    // Draw each line of text
    lines.forEach((line, index) => {
        const lineWidth = ctx.measureText(line).width;
        const xPosition = align === 'right' ? x + (maxWidth - lineWidth) : x;
        ctx.fillText(line, xPosition, y + (index * lineHeight));
    });
}

// Function to create an image with the quote in JPG format
async function createImageWithQuote(quote, author) {
    const width = 1080;
    const height = 1920;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Load the background image
    const backgroundImagePath = path.resolve(__dirname, 'storyBackground.png');
    const backgroundImage = await loadImage(backgroundImagePath);
  
     // Draw the background image
    ctx.drawImage(backgroundImage, 0, 0, width, height);


    //title text
    ctx.fillStyle = '#3b3b3b';
    ctx.font = 'bold 90px Arial';
    ctx.fillText('have a nice day :)',70,125);

    ctx.fillStyle = 'white';
    ctx.font = '75px Helvetica Neue';

    // Define maximum width for text wrapping
    const maxWidth = width - 200; // 100px padding on each side
    const lineHeight = 80; // Adjust line height as needed

    // Wrap and draw the quote
    wrapText(ctx, `"${quote}"`, 100, 300, maxWidth, lineHeight, 'left');

    // Draw the author
    ctx.font = '70px Helvetica Neue'; // Adjust font size for author if needed

    // Calculate starting x-position for right-aligned text
    const authorTextPadding = 70; // Padding from the right edge
    const authorMaxWidth = width - authorTextPadding * 2;

    // Draw the author aligned to the right
    wrapText(ctx, `- ${author}`, authorTextPadding, 970, authorMaxWidth, lineHeight, 'right');


    const buffer = canvas.toBuffer('image/jpeg'); // Change to 'image/jpeg' for JPG format
    
    // Define the absolute path for the image
    const imagePath = path.resolve(__dirname, 'quote_image.jpg');
    fs.writeFileSync(imagePath, buffer);
    return imagePath;
}

// Function to upload the image to Instagram
const uploadStory = async (imagePath) => {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

    try {
        // Read the file as a buffer
        const fileBuffer = await readFileAsync(imagePath);
        
        // Upload the story
        await ig.publish.story({
            file: fileBuffer
        });
        console.log('Story posted successfully');
    } catch (error) {
        console.error('Error uploading story:', error.response ? error.response.data : error.message);
    }
}

async function main() {
    try {
        // Fetch a random quote
        const { quote, author } = await getRandomQuote();

        // Create an image with the quote and get the absolute path
        const imagePath = await createImageWithQuote(quote, author);

        // Upload the image to Instagram
        await uploadStory(imagePath);
    } catch (error) {
        console.error('Error in the main function:', error);
    }
}

async function imageTest() {
    try {
        // Fetch a random quote
        const { quote, author } = await getRandomQuote();

        // Create an image with the quote and get the absolute path
        await createImageWithQuote(quote, author);

        // Upload the image to Instagram
        // await uploadStory(imagePath);
    } catch (error) {
        console.error('Error in the main function:', error);
    }
}

//imageTest();
main();