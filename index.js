// require('dotenv').config();

// console.log(process.env.port);
// console.log(process.env.name);

// const OpenAI = require('openai');
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const getWeather = require('./weather.js');

// const weatherFunctionSpec = {
//     "name": "weather",
//     "description": "Get the current weather for a city",
//     "parameters": {
//         "type": "object",
//         "properties": {
//             "city": {
//                 "type": "string",
//                 "description": "The city"
//             }
//         },
//         "required": ["city"]
//     }
// };
// messages=[
//     { role: "user", content: "Is weather sunnier in vijayawada than in hyderabad" }

// ]
// const apicall = async () => {
//     console.log("--------------------------------First request-----------------------")
//      console.log(messages)
//     const response = await openai.chat.completions.create({
//         model: 'gpt-3.5-turbo',
//         messages: messages,
//         functions: [weatherFunctionSpec]
//     });

//    let responseMessage = response.choices[0].message;
//     messages.push(responseMessage)
//     if (responseMessage.function_call?.name === 'weather') {
//         const args = JSON.parse(responseMessage.function_call.arguments);
//         const city = args.city;
//         console.log("gpt asked to call getweather for city:", city);
//         debugger;
//         const weather = await getWeather(city);
//         // console.log("result", weather);

//         // call GPT and give it the weather data
//         messages.push({role:"function",name:"getWeather",content:JSON.stringify(weather)})
//         console.log("--------------------------------Second request-----------------------")
//         console.log(messages)
//         //second request
//         const response = await openai.chat.completions.create({
//             model: 'gpt-3.5-turbo',
//             messages: messages,
//             functions: [weatherFunctionSpec]
//         });
//         console.log(response.choices[0].message);

//     }

//     // console.log(responseMessage);
// };

// apicall();


require('dotenv').config();
// app.use(bodyParser.json());
// app.use(cors({ origin: '*' }));

// app.get('/', (req, res) => {
//   res.send('hi');
// });

// console.log(process.env.port);
// console.log(process.env.name);

// const OpenAI = require('openai');
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const getWeather = require('./weather.js');

// const weatherFunctionSpec = {
//     "name": "weather",
//     "description": "Get the current weather for a city",
//     "parameters": {
//         "type": "object",
//         "properties": {
//             "city": {
//                 "type": "string",
//                 "description": "The city"
//             }
//         },
//         "required": ["city"]
//     }
// };

// async function callGpt(model, systemPrompt, userPrompt) {
//     let messages = [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userPrompt }
//     ];

//     while (true) {
//         console.log(messages);
//         const response = await openai.chat.completions.create({
//             model: model,
//             messages: messages,
//             functions: [weatherFunctionSpec]
//         });
//         let responseMessage = response.choices[0].message;
//         console.log("got response", responseMessage);

//         if (responseMessage.function_call?.name === 'weather') {
//             const args = JSON.parse(responseMessage.function_call.arguments);
//             const city = args.city;
//             console.log("GPT asked to call getWeather for city:", city);
//             const weather = await getWeather(city);
//             messages.push({ role: "function", name: "getWeather", content: JSON.stringify(weather) });
//         }

//         messages.push(responseMessage);

//         // Check if the finish reason is 'stop'
//         if (response.choices[0]?.finish_reason === 'stop') {
//             return responseMessage;
//         }
//     }
// }

// const fun=async()=>{
//     const finalMessage= await callGpt('gpt-3.5-turbo', "You give very short answers"," give me weather of all cities with city names  delhi, mumbai,Bangalore ");
// console.log("hi")
// console.log("final message",finalMessage)
// }
// fun()

const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const cors = require('cors');
const axios = require('axios');
const getWeather = require('./weather.js');

const app = express();
const port = 3001; // Define your desired port

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const weatherFunctionSpec = {
    "name": "weather",
    "description": "Get the current weather for a city",
    "parameters": {
        "type": "object",
        "properties": {
            "city": {
                "type": "string",
                "description": "The city"
            }
        },
        "required": ["city"]
    }
};

async function callGpt(model, systemPrompt, userPrompt) {
    let messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ];

    while (true) {
        const response = await openai.chat.completions.create({
            model: model,
            messages: messages,
            functions: [weatherFunctionSpec]
        });
        let responseMessage = response.choices[0].message;

        if (responseMessage.function_call?.name === 'weather') {
            const args = JSON.parse(responseMessage.function_call.arguments);
            const city = args.city;
            const weather = await getWeather(city);
            messages.push({ role: "function", name: "getWeather", content: JSON.stringify(weather) });
        }

        messages.push(responseMessage);

        if (response.choices[0]?.finish_reason === 'stop') {
            return responseMessage;
        }
    }
}

// app.post('/askGpt', async (req, res) => {
//     try {
//         const {  currentMessage,recentMessage} = req.body;
//         console.log(req.body)
//         let messages = [];
//         if (recentMessage) {
//             messages.push({
//                 "role": "user",
//                 "content": recentMessage
//             });
//         }

//         messages.push({
//             "role": "user",
//             "content": currentMessage
//         });

        
//         console.log(currentMessage)
//         const systemPrompt="You give very short answers"
//         const model='gpt-3.5-turbo'
//         const finalMessage = await callGpt(model,systemPrompt,messages);
//         console.log("finalmessage",finalMessage)
//         res.json({success: true,  message: finalMessage.content });
//     } catch (error) {
//         console.log(error.message)
//         res.status(500).json({ error: error.message });
//     }
// });


/// it is main working code 
// app.post('/askGpt', async (req, res) => {
//     try {
//         const { currentMessage, recentMessage } = req.body;
//         console.log(req.body);

//         // Initialize messages array
//         let messages = [];

//         // Add recent message to messages array if available
//         if (recentMessage) {
//             messages.push({
//                 role: "user",
//                 content: recentMessage
//             });
//         }

//         // Add current message to messages array
//         messages.push({
//             role: "user",
//             content: currentMessage
//         });

//         // Call GPT function
//         const systemPrompt = "You give very short answers";
//         const model = 'gpt-3.5-turbo';
//         const finalMessage = await callGpt(model, systemPrompt, JSON.stringify(messages));

//         console.log("finalmessage", finalMessage);
//         res.json({ success: true, message: finalMessage.content });
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ error: error.message });
//     }
// });

app.post('/askGpt', async (req, res) => {
    try {
        const { currentMessage, recentMessage } = req.body;
        console.log(req.body);
        let messages = [];

        if (recentMessage) {
            messages.push({
                role: "user",
                content: recentMessage
            });
        }

        messages.push({
            role: "user",
            content: currentMessage
        });

        
        const systemPrompt = "You give very short answers";
        const model = 'gpt-3.5-turbo';
        console.log("hey i am the message box",messages)
        const finalMessage = await callGpt(model, systemPrompt, JSON.stringify(messages));

        console.log("finalmessage", finalMessage);

        let messageContent = finalMessage.content;
        try {
        
            const parsedContent = JSON.parse(messageContent);

            if (parsedContent.main && parsedContent.weather && parsedContent.name) {
                messageContent = `The current temperature in ${parsedContent.name} is ${parsedContent.main.temp}°C and the weather is ${parsedContent.weather[0].main}.`;
            }
        } catch (error) {
            // Content is not JSON, use it as is
        }

        res.json({ success: true, message: messageContent });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});


app.get('/', (req, res) => {
  res.send('hi');
});