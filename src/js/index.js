import { renderPlaylist } from './functions.js';
import { resizeCanvas } from './utils.js';

window.addEventListener("resize", resizeCanvas); 
resizeCanvas(); // Изменение размера поля с визуализацией при изменении размера окна
renderPlaylist(); // Отображение списка загруженных треков