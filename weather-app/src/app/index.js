import Head from 'next/head';
import Image from 'next/image';
import {useState} from 'react';

export default function Home() {
    const [weather, setWeather] = useState({});
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=dubai&appid=${NEXT_PUBLIC_WEATHER_KEY}`;
}