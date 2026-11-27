/* ============================================================================
   data.js — все данные сайта в одном месте.

   Резервный источник данных. Если MySQL доступен, script.js берёт данные
   из /api/site-data (база), а этот файл используется как запасной вариант.

   Структура:
     SITE_DATA.cuisines — кухни (главная страница и вкладки стран в меню)
     SITE_DATA.cities   — города (страница городов)
     SITE_DATA.menus    — блюда и вкладки-категории для каждой кухни
   ============================================================================ */

window.SITE_DATA = {

  /* --------------------------------------------------------------------------
     1. КУХНИ
     key — используется в адресе: menu.html?cuisine=italian
     native — короткая подпись «с вайбом» страны (по латинице)
     -------------------------------------------------------------------------- */
  cuisines: [
    { key: 'italian',    name: 'Итальянская', native: 'Italia',    description: 'Паста, пицца, оливковое масло и неспешные ужины.' },
    { key: 'russian',    name: 'Русская',     native: 'Русь',      description: 'Борщ, пирожки, гречка и домашнее тепло в каждой тарелке.' },
    { key: 'japanese',   name: 'Японская',    native: '日本',       description: 'Роллы, мисо, рамен и точность каждой детали.' },
    { key: 'french',     name: 'Французская', native: 'France',    description: 'Соусы, вино, луковый суп и десерты на каждый день.' },
    { key: 'american',   name: 'Американская', native: 'USA',      description: 'Бургеры, фри, барбекю и большие порции.' },
    { key: 'english',    name: 'Английская',  native: 'England',   description: 'Fish & chips, ростбиф, йоркшир и чай с молоком.' },
    { key: 'belarusian', name: 'Белорусская', native: 'Беларусь',  description: 'Драники, холодник, мачанка и деревенский сырник.' },
    { key: 'korean',     name: 'Корейская',   native: '한국',       description: 'Кимчи, бибимбап, ттокбокки и острые соусы.' },
    { key: 'chinese',    name: 'Китайская',   native: '中国',       description: 'Вонтоны, утка по-пекински, цзяоцзы и лагман.' }
  ],

  /* --------------------------------------------------------------------------
     2. ГОРОДА ДОСТАВКИ
     key — используется в адресе: menu.html?city=moscow
     -------------------------------------------------------------------------- */
  cities: [
    { key: 'moscow',     name: 'Москва',     latin: 'MOSCOW',     description: 'Центр, Хамовники, Пресня. 24 ресторана.' },
    { key: 'balashikha', name: 'Балашиха',   latin: 'BALASHIKHA', description: 'Заречье, Южный, Леоново. 11 ресторанов.' },
    { key: 'lyubertsy',  name: 'Люберцы',    latin: 'LYUBERTSY',  description: 'Центр, Октябрьский, Волковская. 8 ресторанов.' },
    { key: 'zhukovsky',  name: 'Жуковский',  latin: 'ZHUKOVSKY',  description: 'Авиагородок, Центр, Костино. 6 ресторанов.' },
    { key: 'ramenskoye', name: 'Раменское',  latin: 'RAMENSKOYE', description: 'Центр, Южный, Гжелка. 7 ресторанов.' },
    { key: 'korolev',    name: 'Королёв',    latin: 'KOROLEV',    description: 'Центр, Подлипки, Болшево. 9 ресторанов.' }
  ],

  /* --------------------------------------------------------------------------
     3. МЕНЮ ПО КУХНЯМ

     categories — именно эти слова станут вкладками на странице меню.
     dish.image — путь к картинке, которую вы добавите в папку img/dishes/
     dish.alt   — текст для картинки (заполнен заранее)
     -------------------------------------------------------------------------- */
  menus: {

    italian: {
      categories: ['Закуски', 'Паста', 'Пицца', 'Десерты'],
      dishes: [
        { id: 'it-01', name: 'Брускетта с томатами', category: 'Закуски', price: 390, image: 'img/brussketa.jpg', alt: 'Брускетта с томатами и базиликом' },
        { id: 'it-02', name: 'Карбонара',             category: 'Паста',   price: 690, image: 'img/karboanara.jpg', alt: 'Спагетти карбонара с беконом' },
        { id: 'it-03', name: 'Лазанья',               category: 'Паста',   price: 720, image: 'img/lazanya.jpg', alt: 'Лазанья с мясным рагу' },
        { id: 'it-04', name: 'Маргарита',             category: 'Пицца',   price: 790, image: 'img/maragaritta.jpg', alt: 'Пицца Маргарита с моцареллой' },
        { id: 'it-05', name: 'Тирамису',              category: 'Десерты', price: 450, image: 'img/tiramisvsu.jpg', alt: 'Десерт тирамису' }
      ]
    },

    russian: {
      categories: ['Супы', 'Пирожки', 'Основное', 'Десерты'],
      dishes: [
        { id: 'ru-01', name: 'Борщ со сметаной',     category: 'Супы',     price: 420, image: 'img/borsch.jpg', alt: 'Борщ со сметаной и зеленью' },
        { id: 'ru-02', name: 'Пирожок с капустой',   category: 'Пирожки',  price: 180, image: 'img/pirozhki.jpg', alt: 'Пирожок с капустой' },
        { id: 'ru-03', name: 'Бефстроганов',         category: 'Основное', price: 780, image: 'img/beftroganov.jpg', alt: 'Бефстроганов с картошкой' },
        { id: 'ru-04', name: 'Гречка с грибами',     category: 'Основное', price: 560, image: 'img/grechka.jpg', alt: 'Гречка с лесными грибами' },
        { id: 'ru-05', name: 'Медовик',              category: 'Десерты',  price: 390, image: 'img/medovik.jpg', alt: 'Торт медовик' }
      ]
    },

    japanese: {
      categories: ['Супы', 'Роллы', 'Закуски', 'Основное', 'Десерты'],
      dishes: [
        { id: 'ja-01', name: 'Мисо-суп',         category: 'Супы',     price: 290, image: 'img/misosup.jpg', alt: 'Мисо-суп с тофу' },
        { id: 'ja-02', name: 'Филадельфия',      category: 'Роллы',    price: 690, image: 'img/roly.jpg', alt: 'Роллы Филадельфия с лососем' },
        { id: 'ja-03', name: 'Гёдза',            category: 'Закуски',  price: 420, image: 'img/gedza.jpg', alt: 'Японские пельмени гёдза' },
        { id: 'ja-04', name: 'Рамен с курицей',  category: 'Основное', price: 720, image: 'img/ramen.jpg', alt: 'Рамен с курицей и яйцом' },
        { id: 'ja-05', name: 'Моти',             category: 'Десерты',  price: 350, image: 'img/moti.jpg', alt: 'Японские сладости моти' }
      ]
    },

    french: {
      categories: ['Супы', 'Закуски', 'Основное', 'Десерты'],
      dishes: [
        { id: 'fr-01', name: 'Луковый суп',            category: 'Супы',     price: 480, image: 'img/lukovyy.jpg', alt: 'Французский луковый суп с сыром' },
        { id: 'fr-02', name: 'Салат с козьим сыром',   category: 'Закуски',  price: 560, image: 'img/salat.jpg', alt: 'Салат с козьим сыром и орехами' },
        { id: 'fr-03', name: 'Крок-месье',             category: 'Основное', price: 640, image: 'img/kroe.jpg', alt: 'Сэндвич крок-месье' },
        { id: 'fr-04', name: 'Бёф бургиньон',          category: 'Основное', price: 890, image: 'img/yuufik.jpg', alt: 'Бёф бургиньон в красном вине' },
        { id: 'fr-05', name: 'Крем-брюле',             category: 'Десерты',  price: 420, image: 'img/krembryule.jpg', alt: 'Десерт крем-брюле' }
      ]
    },

    american: {
      categories: ['Бургеры', 'Закуски', 'Десерты', 'Напитки'],
      dishes: [
        { id: 'us-01', name: 'Чизбургер',         category: 'Бургеры',  price: 590, image: 'img/chizburgers.jpg', alt: 'Чизбургер с говяжьей котлетой' },
        { id: 'us-02', name: 'Бургер с барбекю',  category: 'Бургеры',  price: 670, image: 'img/burgerssousom.jpg', alt: 'Бургер с соусом барбекю' },
        { id: 'us-03', name: 'Картофель фри',     category: 'Закуски',  price: 240, image: 'img/kartofel.jpg', alt: 'Картофель фри' },
        { id: 'us-04', name: 'Чизкейк',           category: 'Десерты',  price: 430, image: 'img/chizkeye.jpg', alt: 'Чизкейк на тонком корже' },
        { id: 'us-05', name: 'Дальгона-кофе',     category: 'Напитки',  price: 220, image: 'img/kofe.jpg', alt: 'Стакан кофе с молоком' },
        { id: 'us-08', name: 'Coca-Cola',         category: 'Напитки',  price: 220, image: 'image/kola.jpg', alt: 'Кола' },
        { id: 'us-06', name: 'Lipton - Tea',      category: 'Напитки',    price: 220, image: 'image/lipton.jpg', alt: 'Чай Липтон' },
        { id: 'us-07', name: 'Клубничный Коктейль',category: 'Напитки',  price: 220, image: 'image/kotkely.jpg', alt: 'Коктейль ' }
      ]
    },

    english: {
      categories: ['Закуски', 'Основное', 'Десерты', 'Напитки'],
      dishes: [
        { id: 'gb-01', name: 'Йоркширский пудинг', category: 'Закуски',  price: 380, image: 'img/puding.jpg', alt: 'Йоркширский пудинг' },
        { id: 'gb-02', name: 'Fish and chips',     category: 'Основное', price: 720, image: 'img/ryba.jpg', alt: 'Жареная рыба с картофелем' },
        { id: 'gb-03', name: 'Ростбиф',            category: 'Основное', price: 850, image: 'img/rostbif.jpg', alt: 'Ростбиф с овощами' },
        { id: 'gb-04', name: 'Трайфл',             category: 'Десерты',  price: 410, image: 'img/trayfl.jpg', alt: 'Английский десерт трайфл' },
        { id: 'gb-05', name: 'Чай с молоком',      category: 'Напитки',  price: 200, image: 'img/tea.jpg', alt: 'Чашка чая с молоком' }
      ]
    },

    belarusian: {
      categories: ['Супы', 'Пирожки', 'Основное', 'Десерты'],
      dishes: [
        { id: 'by-01', name: 'Холодник',             category: 'Супы',     price: 360, image: 'image/holodnik.jpg', alt: 'Холодник со сметаной' },
        { id: 'by-02', name: 'Пирожок с картошкой',  category: 'Пирожки',  price: 170, image: 'image/kartoshkie.jpg', alt: 'Пирожок с картошкой' },
        { id: 'by-03', name: 'Драники',              category: 'Основное', price: 520, image: 'image/draniki.jpg', alt: 'Картофельные драники' },
        { id: 'by-04', name: 'Мачанка',              category: 'Основное', price: 690, image: 'image/mochanka.jpg', alt: 'Мачанка с мясом' },
        { id: 'by-05', name: 'Творожный сырник',     category: 'Десерты',  price: 330, image: 'image/tvorog.jpg', alt: 'Творожный сырник' }
      ]
    },

    korean: {
      categories: ['Супы', 'Закуски', 'Основное', 'Напитки'],
      dishes: [
        { id: 'kr-01', name: 'Кимчи-суп',      category: 'Супы',     price: 540, image: 'image/kamchi.jpg', alt: 'Корейский суп с кимчи' },
        { id: 'kr-02', name: 'Кимчи',          category: 'Закуски',  price: 290, image: 'image/kimchi.jpg', alt: 'Корейская закуска кимчи' },
        { id: 'kr-03', name: 'Ттокбокки',      category: 'Закуски',  price: 480, image: 'image/risovyk.jpg', alt: 'Корейские рисовые палочки в соусе' },
        { id: 'kr-04', name: 'Бибимбап',       category: 'Основное', price: 760, image: 'image/bibib.jpg', alt: 'Бибимбап с рисом и овощами' },
        { id: 'kr-05', name: 'Бубча-чай',      category: 'Напитки',  price: 260, image: 'image/babcha.jpg', alt: 'Чай бубча' }
      ]
    },

    chinese: {
      categories: ['Супы', 'Закуски', 'Основное', 'Десерты'],
      dishes: [
        { id: 'cn-01', name: 'Вонтон-суп',          category: 'Супы',     price: 460, image: 'image/supvonton.jpg', alt: 'Китайский суп с вонтонами' },
        { id: 'cn-02', name: 'Цзяоцзы',             category: 'Закуски',  price: 430, image: 'image/tszyaotszy.jpg', alt: 'Китайские пельмени цзяоцзы' },
        { id: 'cn-03', name: 'Утка по-пекински',    category: 'Основное', price: 990, image: 'image/utka.jpg', alt: 'Утка по-пекински' },
        { id: 'cn-04', name: 'Лагман',              category: 'Основное', price: 680, image: 'image/lagman.jpg', alt: 'Лагман с овощами и мясом' },
        { id: 'cn-05', name: 'Манго-пудинг',        category: 'Десерты',  price: 350, image: 'image/mango.jpg', alt: 'Китайский манго-пудинг' }
      ]
    }
  }
};
