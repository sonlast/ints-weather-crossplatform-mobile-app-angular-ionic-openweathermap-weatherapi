import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  WeatherApiService,
  WeatherDataResponse,
} from '../service/weather-api.service';
import { AlertController, IonSearchbar } from '@ionic/angular';
import { Subscription } from 'rxjs';
import {
  faWind,
  faDroplet,
  faEye,
  faEyeLowVision,
  faEyeSlash,
  faTemperatureHalf,
} from '@fortawesome/free-solid-svg-icons';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  wind = faWind;
  droplet = faDroplet;
  eye = faEye;
  lowvis_eye = faEyeLowVision;
  slashed_eye = faEyeSlash;
  therm = faTemperatureHalf;

  currentLocation = 'Manila';
  currentDate = new Date();
  currentDateIntervalId?: number;
  isFahrenheit = false;
  hourlyForecast: any[] = [];
  dailyForecast: any[] = [];
  num = 0;
  private intervalId?: number;
  private subscription: Subscription = new Subscription();

  @ViewChild('searchBar') searchBar!: IonSearchbar;
day: any;

  constructor(
    private weatherService: WeatherApiService,
    private alertCtrl: AlertController
  ) {}  

  ngOnInit() {
    this.getWeatherInformation(this.currentLocation);
    this.intervalId = window.setInterval(() => {
      this.getWeatherInformation(this.currentLocation);
    }, 3600000);

    this.currentDateIntervalId = window.setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.currentDateIntervalId) {
      clearInterval(this.currentDateIntervalId);
    }
    this.subscription.unsubscribe();
  }

  public getWeatherInformation(queryString: string): void {
    this.currentLocation = queryString;
    this.num++;
    console.log(`API Calls: ${this.num}. Input`, queryString);

    this.weatherService.getCurrentWeather(queryString).subscribe(
      (result: WeatherDataResponse) => {
        this.weatherService.weatherData = result.openWeatherMap;
        this.weatherService.weatherDataHD = result.weatherAPI;
        this.isFahrenheit = false;
        console.log('weatherData', this.weatherService.weatherData);
        console.log('weatherDataHD', this.weatherService.weatherDataHD);
        
        let currentTime = new Date();
        this.hourlyForecast =
          this.weatherService.weatherDataHD.forecast.forecastday[0].hour.filter(hour => {
            let hourTime = new Date(hour.time);
            return hourTime > currentTime;
          });

        let today = new Date();
        today.setHours(0, 0, 0, 0);

        this.dailyForecast =
          this.weatherService.weatherDataHD.forecast.forecastday.filter(day => {
            let forecastDate = new Date(day.date);
            forecastDate.setHours(0, 0, 0, 0);
            return forecastDate.getTime() !== today.getTime();
          });
      },
      (err) => {
        let errorMessage =
          'There is a problem in getting the weather info. Please try again later.';
        if (err.status === 404) {
          console.log('It tried to give the error');
          errorMessage = `Location doesn't exist`;
        }
        this.alertCtrl
          .create({
            header: 'Unable to get the info.',
            message: errorMessage,
            cssClass: 'locationnotfound',
            buttons: [
              {
                text: 'Dismiss',
                handler: () => {
                  this.searchBar.value = '';
                },
              },
            ],
          })
          .then((alert) => alert.present());
      }
    );
  }

  public get weatherData() {
    return this.weatherService.weatherData;
  }

  public get weatherDataHD() {
    return this.weatherService.weatherDataHD;
  }

  public getTemperature() {
    if (
      this.weatherService.weatherData &&
      this.weatherService.weatherData.main
    ) {
      const temp = this.weatherService.weatherData.main.temp;
      const isHigh = this.isFahrenheit ? temp > 78.8 : temp > 26;
      return isHigh ? 'high' : 'low';
    }
    return '';
  }

  public getTemperatureColor() {
    if (
      this.weatherService.weatherData &&
      this.weatherService.weatherData.main
    ) {
      const temp = this.weatherService.weatherData.main.temp;
      const isHigh = this.isFahrenheit ? temp > 78.8 : temp > 26;
      return isHigh ? 'red' : 'dark_blue';
    }
    return '';
  }

  public convertToFahrenheit() {
    if (
      this.weatherService.weatherData &&
      this.weatherService.weatherData.main
    ) {
      this.weatherService.weatherData.main.temp = Math.round(
        (this.weatherService.weatherData.main.temp * 9) / 5 + 32
      );
      this.weatherService.weatherData.main.temp_min = Math.round(
        (this.weatherService.weatherData.main.temp_min * 9) / 5 + 32
      );
      this.weatherService.weatherData.main.temp_max = Math.round(
        (this.weatherService.weatherData.main.temp_max * 9) / 5 + 32
      );
      this.weatherService.weatherData.main.feels_like = Math.round(
        (this.weatherService.weatherData.main.feels_like * 9) / 5 + 32
      );
      this.weatherService.weatherDataHD.forecast.forecastday[0].hour.forEach(
        (hour) => {
          hour.temp_c = Math.round((hour.temp_c * 9) / 5 + 32);
        }
      );
      this.weatherService.weatherDataHD.forecast.forecastday.forEach((day) => {
        day.day.maxtemp_c = Math.round((day.day.maxtemp_c * 9) / 5 + 32);
        day.day.mintemp_c = Math.round((day.day.mintemp_c * 9) / 5 + 32);
      });
      this.isFahrenheit = true;
    }
  }

  public convertToCelsius() {
    if (
      this.weatherService.weatherData &&
      this.weatherService.weatherData.main
    ) {
      this.weatherService.weatherData.main.temp = Math.round(
        ((this.weatherService.weatherData.main.temp - 32) * 5) / 9
      );
      this.weatherService.weatherData.main.temp_min = Math.round(
        ((this.weatherService.weatherData.main.temp_min - 32) * 5) / 9
      );
      this.weatherService.weatherData.main.temp_max = Math.round(
        ((this.weatherService.weatherData.main.temp_max - 32) * 5) / 9
      );
      this.weatherService.weatherData.main.feels_like = Math.round(
        ((this.weatherService.weatherData.main.feels_like - 32) * 5) / 9
      );
      this.weatherService.weatherDataHD.forecast.forecastday[0].hour.forEach(
        (hour) => {
          hour.temp_c = Math.round((hour.temp_c - 32) * 5) / 9;
        }
      );
      this.weatherService.weatherDataHD.forecast.forecastday.forEach((day) => {
        day.day.maxtemp_c = Math.round((day.day.maxtemp_c - 32) * 5) / 9;
        day.day.mintemp_c = Math.round((day.day.mintemp_c - 32) * 5) / 9;
      });
      this.isFahrenheit = false;
    }
  }

  public toggleTemperature() {
    if (this.isFahrenheit) {
      this.convertToCelsius();
    } else {
      this.convertToFahrenheit();
    }
  }
}
