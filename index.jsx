require("dotenv").config();
const { IgApiClient } = require('instagram-private-api');
const axios = require('axios');
const { createCanvas } = require('canvas');
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

// Function to create an image with the quote in JPG format
async function createImageWithQuote(quote, author) {
    const width = 1080;
    const height = 1920;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'black';
    ctx.font = '48px Arial';
    ctx.fillText(`"${quote}"`, 50, 100);
    ctx.fillText(`- ${author}`, 50, 200);

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

main();