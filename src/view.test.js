import {
  showCity,
  makeShowButtonVisible,
  addToHistory,
  showWeather,
} from './view';

beforeAll(() => {
  document.body.innerHTML = `<main>
            <div className="row g-5">
                <div className="col-md-8">
                    <form className="row g-3" onSubmit="return false;">
                        <div className="col input-group mb-3">
                            <input id="input" type="text" className="form-control"
                                placeholder="Weather"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                />
                        </div>
                        <div className="col">
                            <button
                                id="show"
                                type="submit"
                                className="btn btn-primary mb-3"
                                disabled
                            >
                                Show
                            </button>
                        </div>
                    </form>
                    <div className="row row-cols-2">
                        <div className="col">
                            <img
                                id="map"
                                src="map.png"
                                className="img-fluid rounded p-1"
                                alt="map"
                            />
                        </div>
                        <div className="col" id="weather"><h2 id="city">Weather info</h2><p id="temp">Current: <b></b><br/>Max: <b></b><br/>Min: <b></b><br/></p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <ul className="list-group" id="history">
                        <li className="list-group-item active" aria-current="true">
                            History </li>
                    </ul>
                </div>
            </div>
        </main>`;
});

it('should show city in header', () => {
  // const div = document.createElement('div');
  // div.setAttribute('id', 'weather');
  // const h2 = document.createElement('h2');
  // h2.setAttribute('id', 'city');
  // h2.innerText = 'Weather info';
  // div.appendChild(h2);
  // document.body.append(div);
  showCity('Moscow');
  expect(document.querySelector('#city').innerText).toEqual('Moscow');
});

it('should make show button visible', () => {
  const event = new Event('change');
  const input = document.getElementById('input');
  input.addEventListener('change', makeShowButtonVisible);
  input.value = 'SomeCity';
  input.dispatchEvent(event);
  expect(document.querySelector('#show').hasAttribute('disabled')).toBeFalsy();
});

it('should make show button invisible', () => {
  const event = new Event('change');
  const input = document.getElementById('input');
  input.addEventListener('change', makeShowButtonVisible);
  input.value = '';
  input.dispatchEvent(event);
  expect(document.querySelector('#show').hasAttribute('disabled')).toBeTruthy();
});

it('should add city and lat lot to history', () => {
  addToHistory('Moscow', 100, 200);
  const history = document.getElementById('history');
  const list = history.querySelector('li.list-group-item:not(li.active)');
  expect(list.innerHTML).toBe(
    '<a href="#" data-lat="100" data-lon="200">Moscow</a>',
  );
});

it('should add temp to the fields', () => {
  showWeather(20, 10, 30, '10d');
  const weather = document.querySelector('#weather > p');
  expect(weather.innerHTML).toBe(
    'Current: <b>20</b><br>Max: <b>30</b><br>Min: <b>10</b><br>',
  );
});

it('should add weather picture', () => {
  showWeather(20, 10, 30, '10d');
  const img = document.querySelector('#weather > img');
  expect(img.src).toBe('https://openweathermap.org/img/wn/10d@4x.png');
});
