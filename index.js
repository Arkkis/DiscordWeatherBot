// https://discord.com/api/oauth2/authorize?client_id=1158337339362390076&scope=applications.commands
import axios from "axios";
import { Client, GatewayIntentBits } from "discord.js";
import Cache from "./cache.mjs";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const cache = new Cache();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "sää") {
    const userCity = interaction.options.getString("city");
    const trimmedCity = userCity.replace(/[^a-zA-Z]/g, "");

    const oldValue = cache.get(trimmedCity);

    if (oldValue !== null) {
      console.log(oldValue, "from cache");
      await interaction.reply(oldValue);
      return;
    }

    const data = await getWeather(trimmedCity);

    if (data === null || data === undefined) {
      await interaction.reply(`Kaupunkia "${trimmedCity}" ei löydy`);
    } else {
      await interaction.deferReply();
      const formattedReply = formatReply(data);
      console.log(formattedReply);
      cache.set(trimmedCity, formattedReply);
      await interaction.editReply(formattedReply);
    }
  }
});

client.login(process.env.BOT_TOKEN);

const getWeather = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},FI&appid=${process.env.WEATHER_API_KEY}`
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    } else {
      console.error("An error occurred:", error);
    }
  }
};

function formatReply(weatherData) {
  if (
    !weatherData ||
    !weatherData.weather ||
    !weatherData.main ||
    !weatherData.name
  ) {
    return "Invalid data";
  }

  const cityName = weatherData.name;
  const temperature = Math.round(weatherData.main.temp - 273.15);
  const weather = weatherData.weather[0].main;

  let weatherIcon;

  switch (weather) {
    case "Clouds":
      weatherIcon = "⛅️";
      break;
    case "Rain":
      weatherIcon = "🌧";
      break;
    case "Sun":
      weatherIcon = "☀️";
      break;
    case "Snow":
      weatherIcon = "❄️";
      break;
    default:
      weatherIcon = "🌥";
  }

  return `${cityName}: ${weatherIcon}  ${
    temperature > 0 ? "+" : ""
  }${temperature}°C`;
}
