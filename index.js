// https://discord.com/api/oauth2/authorize?client_id=1158337339362390076&scope=applications.commands
import https from "https";
import { Client, GatewayIntentBits } from "discord.js";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "sää") {
    const userCity = interaction.options.getString("city");
    const data = await fetchWeather(userCity);
    await interaction.reply(data);
  }
});

client.login(process.env.BOT_TOKEN);

const getWeather = async (city) => {
  return new Promise((resolve, reject) => {
    const trimmedCity = city.replace(/[^a-zA-Z]/g, "");
    const req = https.request(
      `https://wttr.in/${trimmedCity}?format=3`,
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });
      }
    );

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
};

const fetchWeather = async (city) => {
  try {
    const weatherData = await getWeather(city);
    return weatherData.toString();
  } catch (error) {
    console.error(error);
  }
};
