


import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- GAME DATA ---
const DEFAULT_HEISTS = [
  { id: 1, title: '1. Ограбление почтового курьера', participants: 4, fee: 10, prize: 3, sheriffCaptures: 1, imageUrl: 'https://github.com/user-attachments/assets/915006b9-37e5-4a6c-9411-137a28e8312d' },
  { id: 2, title: '2. Ограбление почтового дилижанса', participants: 4, fee: 50, prize: 16, sheriffCaptures: 1, imageUrl: 'https://images.unsplash.com/photo-1599427302489-387c539859ab?w=400&h=180&fit=crop&q=80' },
  { id: 3, title: '3. Ограбление пассажирского поезда', participants: 4, fee: 100, prize: 33, sheriffCaptures: 1, imageUrl: 'https://images.unsplash.com/photo-1506012644574-52b8655def89?w=400&h=180&fit=crop&q=80' },
  { id: 4, title: '4. Ограбление казначейского дилижанса', participants: 4, fee: 200, prize: 66, sheriffCaptures: 1, imageUrl: 'https://images.unsplash.com/photo-1544222130-858a436e1b34?w=400&h=180&fit=crop&q=80' },
  { id: 5, title: '5. Ограбление бронированного вагона', participants: 4, fee: 300, prize: 100, sheriffCaptures: 1, imageUrl: 'https://images.unsplash.com/photo-1613203425333-5c21f7553f86?w=400&h=180&fit=crop&q=80' },
  { id: 6, title: '6. Ограбление территориального банка', participants: 5, fee: 400, prize: 266, sheriffCaptures: 2, imageUrl: 'https://images.unsplash.com/photo-1598982359005-4c69b144a173?w=400&h=180&fit=crop&q=80' },
  { id: 7, title: '7. Ограбление городского банка', participants: 5, fee: 500, prize: 333, sheriffCaptures: 2, imageUrl: 'https://images.unsplash.com/photo-1601618218146-563a33575237?w=400&h=180&fit=crop&q=80' },
  { id: 8, title: '8. Ограбление окружного банка', participants: 5, fee: 600, prize: 400, sheriffCaptures: 2, imageUrl: 'https://images.unsplash.com/photo-1518032768599-23c347a32a63?w=400&h=180&fit=crop&q=80' },
  { id: 9, title: '9. Ограбление федерального банка', participants: 5, fee: 800, prize: 533, sheriffCaptures: 2, imageUrl: 'https://images.unsplash.com/photo-1563861929805-493175a40951?w=400&h=180&fit=crop&q=80' },
  { id: 10, title: '10. Ограбление федерального казначейства', participants: 5, fee: 1000, prize: 666, sheriffCaptures: 2, imageUrl: 'https://images.unsplash.com/photo-1589999696328-34863a35b6c3?w=400&h=180&fit=crop&q=80' },
];

const BOT_NAMES = ['Серый Джон', 'Мокрый Майк', 'Ржавый Кольт', 'Грязный Гарри', 'Индеец Джо', 'Чёрная вдова', 'Скользкий Пит', 'Рыжая Соня', 'Одноглазый Джек', 'Малыш Билли'];
const GANG_ICONS = ['💀', '🔥', '🐍', '🦅', '🐺', '🌵', '💣', '⚔️', '💰', '🔪', '🐎', '⚰️', '💎', '👑', '⚱️'];
const BANDIT_PORTRAITS = ['🤠', '🤨', '😎', '🥸', '🧐', '😠', '😏', '😬', '😈', '💀', '🧔‍♂️', '🧔‍♀️', '👩‍🦳', '👩‍🦰'];

const SHOP_ITEMS = [
    { id: 'whiskers', name: '🥸 Фальшивые усы', description: 'снижают шанс попасть в тюрьму на 10%.', prices: [{uses: 3, cost: 10}, {uses: 10, cost: 30}, {uses: 25, cost: 50}] },
    { id: 'horseshoe', name: '🧲 Счастливая подкова', description: 'увеличивает шанс избежать тюрьмы на 20%', prices: [{uses: 3, cost: 15}, {uses: 10, cost: 40}, {uses: 25, cost: 60}] },
];

const BAIL_DATA = {
    1: { cost: 20, teamSpirit: 1 },
    2: { cost: 25, teamSpirit: 1.5 },
    3: { cost: 30, teamSpirit: 2 },
    4: { cost: 35, teamSpirit: 2.5 },
    5: { cost: 40, teamSpirit: 3 },
    6: { cost: 45, teamSpirit: 3.5 },
    7: { cost: 50, teamSpirit: 4 },
    8: { cost: 55, teamSpirit: 4.5 },
    9: { cost: 60, teamSpirit: 5 },
    10: { cost: 65, teamSpirit: 5.5 },
};

const GREETINGS = [
    { icon: '🤠', text: 'Как твои дела, ковбой? Вижу, ты решил попробовать себя в роли настоящего бандита. Здесь всё просто: грабим, делим добычу и стараемся не попасть за решётку. Готов к первому ограблению?' },
    { icon: '🔫', text: 'Ну что, стрелок, шерифы уже в курсе, что ты здесь. Но пока у тебя есть шанс разбогатеть — дерзай! Как насчёт виртуального ограбления с настоящими ставками?' },
    { icon: '🎩', text: 'Хм... Новое лицо в городе. Говорят, тут можно либо разбогатеть, либо проиграть всё. Рискнёшь проверить, на что ты способен?' },
    { icon: '🍾', text: 'Эй, парень, садись. Первый раз у нас? Не волнуйся — даже самые отчающиеся бандиты начинали с малого. Хочешь узнать правила или сразу в бой?' },
    { icon: '💀', text: 'Ты кто такой, и зачем пришёл? А, ну да... новичок. Ладно, слушай сюда: здесь либо грабишь, либо тебя грабят. Выбирай сторону.' },
    { icon: '🎲', text: 'Ого, да у нас новый игрок! Ну что, рискнёшь испытать удачу? В этом городе каждый может стать легендой... или позором. Ха-ха!' },
    { icon: '🏆', text: 'Я видел много стрелков, но все они начинали с первого ограбления. Сможешь ли ты повторить их успех? Покажи, на что способен!' },
    { icon: '🃏', text: 'Приветствую, друг. Вижу, у тебя в глазах азарт. Как насчёт быстрого раунда? Только чур, не зли шерифа...' },
    { icon: '🧙', text: 'Ха! Ещё один искатель приключений. Помни, парень: в этом городе важны не только скорость, но и умение договариваться. Начнём?' },
    { icon: '💃', text: 'О, новый ковбой! Ну что, готов к приключениям? Здесь всё просто: золото, погони и слава. Сыграем?' },
];

const FAILURE_MESSAGES = [
    '🤠🔒 Поздравляем! Твой "гениальный" план сработал... если целью было загреметь в камеру к шерифу.',
    '💀🏚️ Эпик фейл! Ограбление провалено. Шериф уже вешает твоё фото в Зал позора.',
    '👮‍♂️🚪 Находка дня! Шериф лично вручил тебе бесплатную экскурсию в тюрьму. Поздравляем!',
    '🐎💨 Быстро... но не туда! Ты так лихо убегал, что забежал прямиком в тюремные ворота.',
    '🃏☠️ Блеф раскрыт! Шериф назвал твой план "самым смешным за неделю". Теперь смеёшься ты – за решёткой.',
    '💰🚫 Не унесли ни цента... Зато унесли тебя – в холодную камеру с крысой-соседкой.',
    '🌵🔗 Кактус свободен, а ты – нет. Шериф решил, что ты идеально дополнишь его коллекцию неудачников.',
    '🤡🎪 Новый аттракцион! Позорный столб с твоим именем уже в эксплуатации. Ты в тюрьме!',
    '⚖️😭 Судья ржёт, присяжные плачут. Ты не только провалил ограбление, но и подарил городу новую байку.',
    '🏜️🚓 Хотел славы? Получил! Теперь весь город знает, как НЕ надо грабить.',
];

const TUTORIAL_INTRO_MESSAGES = [
    { icon: '🤠✨', text: 'Держи кольт, новичок!\nСегодня грабим... нет, учимся грабить! Деньги подождут, а вот навыки — нет.' },
    { icon: '🎓🔫', text: 'Академия криминала открывает двери!\nПервая лекция: «Как не уронить оружие от волнения». Практика — прямо сейчас!' },
    { icon: '🐎💨', text: 'Разогнались? Отлично!\nТренировочный дилижанс уже ждёт. Пока без денег, зато с адреналином!' },
    { icon: '👶🍼', text: 'Бутылочка для юного бандита!\nСегодня — учебный налёт. Завтра — настоящий! (Ну, может, послезавтра...)' },
    { icon: '🎯🏹', text: 'Стреляй, но учись!\nМишени — банк, пули — учебные, драйв — настоящий!' },
    { icon: '🌵📚', text: 'Урок на пыльной тропе!\nСегодня грабим кактусы. Завтра — банки! (Ну, или послезавтра...)' },
    { icon: '👑🐣', text: 'Цыплёнок сегодня — орёл завтра!\nПервый налёт — как первый шаг. Главное — не упасть... в грязь лицом.' },
    { icon: '💡🔦', text: 'Свет знаний в тёмном переулке!\nТренируйся сейчас — блистай потом! (И не перепутай, где учебный банк, а где настоящий).' },
    { icon: '🚂🌅', text: 'Паровоз опыта отправляется!\nСадись в вагон — впереди карьера лихого бандита! Пока без зарплаты, зато с перспективой.' },
];

const TUTORIAL_GANG_FORMED_MESSAGES = [
    { icon: '🤠🔫', text: 'Банда в сборе!\nСедлай коней, пацаны – сегодня грабим с чувством, с толком, с расстановкой.' },
    { icon: '👥💥', text: 'Команда собрана – пора на дело!\nШериф ещё не знает, но его день вот-вот испортится.' },
    { icon: '🐎💰', text: 'Готовность номер один!\nДилижанс с золотом уже трясётся в предвкушении нашей встречи.' },
    { icon: '🌄🎯', text: 'Рассвет – идеальное время для авантюр!\nБанда готова, цели определены – пора действовать.' },
    { icon: '🃏🏦', text: 'Ставки сделаны!\nБанда готова, банк даже не подозревает, что сегодня его день пойдёт наперекосяк.' },
    { icon: '⚡🚂', text: 'Поезд удачи отправляется!\nВсе на борту – сегодня мы делаем этот город беднее, а себя богаче.' },
    { icon: '🌵🔪', text: 'Кактусы в стороне – банда в деле!\nПора показать, кто тут настоящий хозяин пыльных троп.' },
    { icon: '💣🔥', text: 'Порох сухой, нервы стальные!\nВсё проверено – осталось только нажать на курок.' },
    { icon: '🏆🚪', text: 'Дверь к богатству приоткрыта...\nОсталось лишь толкнуть её плечом (или динамитом).' },
    { icon: '🚀🌅', text: 'Вперед, к славе и золоту!\nБанда собрана, маршрут проложен – осталось только взять своё.' },
];

const TUTORIAL_READY_MESSAGES = [
    { icon: '🤠✨', text: 'Отличная работа, ковбой. Теперь ты знаешь, как это делается – пора переходить к делу, где ставки выше, а награда реальна.' },
    { icon: '🎯🌄', text: 'Неплохо для первого раза. Следующий шаг – показать, на что ты способен, когда на кону настоящие деньги.' },
    { icon: '🔫💼', text: 'Ты освоил основы – теперь пришло время проверить свои навыки в условиях, где ошибки дорого стоят.' },
    { icon: '🎭🔥', text: 'Репетиция прошла идеально. Сцена готова, зрители на местах – пора начинать главное представление.' },
    { icon: '⚡💰', text: 'Ты отработал каждый шаг до автоматизма. Теперь осталось только добавить в уравнение настоящую добычу.' },
    { icon: '🏜️💸', text: 'Учебные дни закончились. Впереди только реальные дела и полные кошельки.' },
    { icon: '🕶️🎖️', text: 'Ты доказал, что умеешь действовать чисто. Теперь докажи, что можешь уйти с чем-то весомым в карманах.' },
    { icon: '🤹‍♂️💎', text: 'Все формальности соблюдены. Осталось только наполнить эти идеальные планы звонкой монетой.' },
    { icon: '🐎🌅', text: 'Ты прошел школу выживания. Теперь пришло время пожинать плоды своих умений.' },
    { icon: '🚂💨', text: 'Тренировка завершена. Теперь ты готов к тому, ради чего всё затевалось – к настоящим деньгам и настоящей славе.' },
];

const cardStyle = { 
  border: '2px solid var(--card-border)', 
  borderRadius: '4px', 
  padding: '16px', 
  marginBottom: '16px', 
  backgroundColor: 'var(--card-bg)', 
  boxShadow: '4px 4px 8px rgba(0,0,0,0.2)', 
  overflow: 'hidden' as const 
};

const RULES_CONTENT = {
    howToStart: (
        <div>
            <h3>Геймплей</h3>
            <p>Ваш персонаж – житель небольшого городка Wild City где-то на Диком Западе. Вам предлагается пройти по «карьерной лестнице» разбойного мира, совершая всё более дерзкие ограбления. Названия игровых уровней, их количество и очерёдность вы можете увидеть на приложенной игровой карте, а также перейдя ниже по кнопке «Игровые уровни».</p>
            <p>Для неопытного новичка восхождение начинается с обучающего уровня «Ограбления почтового курьера». Для этого бандиту-одиночке необходимо присоединиться к одной из банд, уже планирующих подобное ограбление. Состав банды на уровнях 1-5 – главарь и три сообщника; на уровнях 6-10 - главарь и четыре сообщника.</p>
            <p>Чтобы стать сообщником, нужно будет внести свою долю на подкуп охраны и организацию ограбления. Кроме обучающего первого уровня, там участие бесплатное. Далее, чем выше уровень, тем выше взнос - но и больше добыча!</p>
            
            <h3 style={{marginTop: '20px'}}>Как начать игру? Всё просто:</h3>
            <p>1. Зайдите в бота, ознакомьтесь с Правилами.</p>
            <p>2. Пройдите учебное ограбление.</p>
            <p>3. Ознакомьтесь с Личным кабинетом, пополните игровой баланс.</p>
            <p>4. В разделе «Мои бандиты» создайте игрового персонажа (бесплатно - до 5 бандитов).</p>
            <p>5. Для прохождения уровня (совершения ограбления) присоединитесь к одной из набирающихся банд в качестве сообщника и ждите начала ограбления.</p>
            <p>6. После окончания ограбления получите свою долю от общего куша.</p>
            <p>После прохождения уровня в качестве сообщника у вас появится возможность на этом уровне собирать собственные банды.</p>
            
            <p><strong>Важное условие!</strong></p>
            <p>Перейти на следующий уровень можно только после двойного прохождения предыдущего - сначала в качестве сообщника, затем в качестве главаря.</p>
            <p>Участвовать в ограблениях или создавать свои собственные банды на одном и том же уровне можно неограниченное количество раз. Но чем выше уровень, тем выше доход!</p>
            <p>7. Для увеличения игровых характеристик ваших бандитов, и как следствие - повышения шансов на успех в ограблениях, выкупайте попавших в тюрьму сотоварищей и участвуйте в активностях салуна.</p>
        </div>
    ),
    characteristics: (
         <div>
            <h3>Игровые характеристики:</h3>
            <p><strong>Авантюризм</strong> - за участие в ограблениях.<br/>Удельный вес: 0,5</p>
            <p><strong>Удачливость</strong> - за количество успешных ограблений.<br/>Удельный вес: 0,7</p>
            <p><strong>Командный дух</strong> - за выкуп из тюрьмы и привлечение новых игроков (партнёрка).<br/>Удельный вес : 1</p>
            
            <h4 style={{marginTop: '20px'}}>Репутация</h4>
            <p>Репутация - сводная игровая характеристика. Получается в результате суммы Авантюризма, Удачливости и Командного Духа, умноженных на свои удельные веса.</p>
            <div style={{...cardStyle, backgroundColor: 'var(--stats-bg)', textAlign: 'center', fontFamily: "'Rye', cursive", padding: '10px', margin: '10px 0'}}>
                Р = А х 0,5 + У х 0,7 + КД х 1
            </div>
            <p>Игровые характеристики можно также улучшить, покупая соответствующие товары в магазине, или участвуя в активностях салуна.</p>
        </div>
    ),
    finance: (
        <div>
            <h3>Финансы и прибыль</h3>
            <p>Игровой валютой проекта является «Золотой».<br/><strong>Обменный курс: 1 золотой = 1 рубль.</strong></p>
            <p>Обмен рублей на золотые и обратно осуществляется автоматически при зачислении и выводе средств. Зачисление и вывод средств происходят автоматически.</p>
            <p>В роли добычи в основном цикле (10 уровней ограблений различных объектов) выступает доля одного из участников банды, которая (за минусом 5% комиссии проекта) распределяется между остальными игроками. После виртуального совершения ограбления участникам начисляется соответствующее количество игровых денег.</p>
            <p>Подробнее ознакомиться с количеством участников в игровых уровнях, величиной ставки и дохода можно в разделе «Игровые уровни».</p>
            
            <p><strong>Обратите внимание!</strong></p>
            <p>Доход от прохождения уровня получают трое из четырёх (с 1 по 5 уровень) или трое из пяти (с 6 по 10 уровень) участников ограбления.</p>
            <p>«Вылетевшего» игрока как бы поймал шериф и посадил в тюрьму. «Вылетающий» определяется по меньшему баллу совокупности игровых характеристик (см. раздел «Игровые характеристики»). Если у всех участников банды баллы игровых характеристик равны, «вылетающий» определяется случайным образом из числа сообщников. Главарь не выбывает никогда!</p>
        </div>
    ),
};


const NEW_BANDIT_COST = 200;

// --- STYLES ---

const styles = {
    card: cardStyle,
    title: { textAlign: 'center' as const, color: 'var(--text-color)', marginBottom: '20px', letterSpacing: '1px' },
    button: {
        fontFamily: "'Rye', cursive",
        backgroundColor: 'var(--button-bg)', 
        color: 'var(--button-text)', 
        border: '2px solid',
        borderTopColor: 'var(--button-border-top)', 
        borderLeftColor: 'var(--button-border-top)',
        borderBottomColor: 'var(--button-border-bottom)', 
        borderRightColor: 'var(--button-border-bottom)',
        borderRadius: '4px',
        padding: '12px 16px',
        cursor: 'pointer',
        margin: '4px',
        textAlign: 'center' as const,
        fontSize: '14px',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
        textShadow: '1px 1px 0px rgba(255, 255, 255, 0.2)',
        boxShadow: 'inset 0 0 2px rgba(0,0,0,0.2)',
        width: '100%',
        transition: 'all 0.2s ease',
    },
    primaryButton: { 
        backgroundColor: 'var(--primary-button-bg)',
        color: '#fff',
        textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
        borderColor: 'transparent',
    },
    dangerButton: {
        backgroundColor: 'var(--danger-button-bg)',
        color: '#fff',
        textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
        borderColor: 'transparent',
    },
    disabledButton: { 
        backgroundColor: '#E0E0E0',
        borderColor: '#BDBDBD',
        color: '#9E9E9E',
        cursor: 'not-allowed',
        boxShadow: 'none',
        textShadow: 'none',
        filter: 'grayscale(100%)'
    },
    buttonGroup: { display: 'flex', flexDirection: 'column' as const, gap: '8px', marginTop: '16px' },
    shopPriceTag: {
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 'bold',
        color: 'var(--button-text)',
        textShadow: '1px 1px 1px rgba(0,0,0,0.3)',
        boxShadow: 'inset 0 0 3px rgba(0,0,0,0.2)',
        marginLeft: '10px'
    },
    playerStats: {
        border: '3px double var(--card-border)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '20px',
        textAlign: 'center' as const,
        backgroundColor: 'var(--stats-bg)',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)',
    },
    playerStatsDetails: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '8px',
        fontSize: '0.9em',
        borderTop: '1px solid var(--card-border)',
        paddingTop: '8px',
    },
    statItem: {
        borderBottom: '1px dotted var(--text-color)'
    },
    mainNav: { display: 'flex', flexWrap: 'wrap' as const, gap: '8px', marginBottom: '8px' },
    navButton: { flex: 1, minWidth: '120px', fontSize: '13px' },
    backButton: { width: '100%', marginTop: '16px' },
    heistCard: { position: 'relative' as const, padding: 0 },
    heistImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover' as const,
        display: 'block',
    },
    heistContent: {
        padding: '16px',
    },
    heistTitle: {
        textAlign: 'center' as const,
        marginBottom: '16px',
        paddingBottom: '8px',
        borderBottom: '1px dashed var(--card-border)',
        fontSize: '1.4em',
        marginTop: 0,
    },
    heistInfo: { display: 'flex', justifyContent: 'space-around', marginBottom: '16px', fontSize: '1.2em' },
    heistStat: { textAlign: 'center' as const, fontFamily: "'Rye', cursive" },
    heistProgress: { display: 'flex', justifyContent: 'space-around', marginBottom: '16px', borderTop: '1px dashed var(--card-border)', paddingTop: '16px' },
    progressStep: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '4px', fontSize: '14px' },
    progressStepComplete: { color: '#2E7D32', fontWeight: 'bold' },
    progressStepLocked: { color: '#aaa', filter: 'grayscale(100%)' },
    lockedOverlay: { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--heist-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4em', color: 'white', zIndex: 10, borderRadius: '4px' },
    playerRoleText: {
        textAlign: 'center' as const,
        fontSize: '1.3em',
        marginBottom: '16px',
        fontFamily: "'Rye', cursive",
        backgroundColor: 'var(--stats-bg)',
        border: '2px dashed var(--card-border)',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.15)',
    },
    heistResult: { textAlign: 'center' as const, padding: '20px', border: '2px solid', borderRadius: '8px' },
    success: { borderColor: '#2E7D32', color: '#2E7D32', backgroundColor: 'rgba(46, 125, 50, 0.1)'},
    fail: { borderColor: '#C62828', color: '#C62828', backgroundColor: 'rgba(198, 40, 40, 0.1)'},
    gangsScroller: { overflowY: 'auto' as const, maxHeight: '400px', paddingRight: '10px' },
    openGangItem: {
        display: 'flex',
        flexDirection: 'row' as const,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '6px',
        border: '1px solid var(--card-border)',
        marginBottom: '8px',
        gap: '8px',
    },
    gangIcon: { fontSize: '1.8em', lineHeight: 1, flexShrink: 0 },
    gangLeaderName: {
        fontWeight: 'bold',
        fontFamily: "'Rye', cursive",
        marginBottom: '4px',
        fontSize: '14px',
    },
    gangAccomplicesList: {
        fontSize: '12px',
        color: 'var(--text-color)',
        opacity: 0.8,
        marginBottom: '4px',
        fontStyle: 'italic',
        lineHeight: '1.3',
    },
    gangMembersText: { fontSize: '14px', fontFamily: "'Rye', cursive" },
    joinGangButton: { padding: '6px 12px', fontSize: '12px', width: 'auto', flexShrink: 0 },
    gangMembers: { display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '8px' },
    gangMember: { backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease-in-out' },
    gangLeaderMember: {
        backgroundColor: '#A0522D',
        color: '#fff',
        borderColor: 'var(--card-border)',
        boxShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
    },
    playerGangMember: {
        backgroundColor: '#CD853F',
        borderColor: 'var(--card-border)',
        fontWeight: 'bold',
        color: '#fff',
        transform: 'scale(1.03)',
        boxShadow: '0 0 10px rgba(205, 133, 63, 0.6)',
    },
    jailedMessage: { textAlign: 'center' as const, padding: '20px', backgroundColor: 'rgba(198, 40, 40, 0.1)', color: '#C62828', borderRadius: '8px', border: '1px solid #C62828', marginBottom: '16px' },
    activeBanditCard: { borderColor: '#CD853F', borderWidth: '3px', transform: 'scale(1.02)' },
    welcomeMessage: { textAlign: 'center' as const, fontSize: '1.2em', fontStyle: 'italic', marginBottom: '24px', whiteSpace: 'pre-wrap' as const },
    rulesText: { textAlign: 'left' as const, padding: '10px' },
    jailCardGrid: { display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', rowGap: '8px', columnGap: '16px', padding: '12px', marginBottom: '8px' },
    jailCardHeader: { gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' },
    jailCardCell: { display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' },
    jailCardInfoCell: { alignItems: 'flex-start', fontSize: '0.9em' },
    jailCardActionCell: { alignItems: 'center' },
    jailCardPortrait: { fontSize: '3.5em', lineHeight: 1 },
    jailCardName: { margin: 0, fontSize: '1.8em', textAlign: 'left' as const, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 },
    jailCardInfoText: { margin: '2px 0' },
    jailBailButton: { width: 'auto', padding: '6px 9px', fontSize: '13px', whiteSpace: 'nowrap' as const },
    banditProgressContainer: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: '4px',
        border: '1px solid var(--card-border)',
        height: '20px',
        position: 'relative' as const,
        overflow: 'hidden',
    },
    banditProgressBar: {
        backgroundColor: '#2E8B57',
        height: '100%',
        transition: 'width 0.5s ease-in-out',
    },
    banditProgressText: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textShadow: '1px 1px 1px rgba(0,0,0,0.7)',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    levelSliderContainer: {
        position: 'relative' as const,
        padding: '0 40px',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelSliderCard: {
        textAlign: 'center' as const,
        width: '100%',
    },
    levelSliderImage: {
        width: '100%',
        height: '180px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '8px',
        border: '3px solid var(--card-border)',
        marginBottom: '16px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
    levelSliderTitle: {
        fontSize: '1.6em',
        color: 'var(--text-color)',
        margin: '0 0 16px 0',
    },
    levelSliderInfoContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        textAlign: 'left' as const,
    },
    levelSliderInfoItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.1em',
    },
    levelSliderInfoIcon: {
        fontSize: '1.5em',
        marginRight: '8px',
    },
    levelSliderNavArrow: {
        position: 'absolute' as const,
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(139, 69, 19, 0.7)',
        color: '#fff8e1',
        border: '2px solid #fff8e1',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        lineHeight: '1',
        userSelect: 'none' as const,
        transition: 'background-color 0.2s ease',
    },
    levelSliderNavArrowLeft: {
        left: '-10px',
    },
    levelSliderNavArrowRight: {
        right: '-10px',
    },
    lootDistributionCard: {
        ...cardStyle,
        backgroundColor: 'var(--stats-bg)',
        border: '3px double var(--card-border)',
        marginTop: '20px',
    },
    lootSummary: {
        textAlign: 'center' as const,
        fontSize: '1.1em',
        marginBottom: '16px',
    },
    lootDivider: {
        height: '2px',
        backgroundColor: 'var(--card-border)',
        margin: '16px 0',
        border: 'none',
    },
    lootDistributionList: {
        listStyle: 'none',
        padding: 0,
    },
    lootWinnerItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px dashed var(--card-border)',
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    lootLoserItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px dashed var(--card-border)',
        color: '#C62828',
        textDecoration: 'line-through',
    },
    statsSection: {
        borderTop: '1px dashed var(--card-border)',
        marginTop: '16px',
        paddingTop: '16px',
    },
};

// --- HELPER FUNCTIONS ---
const generateBots = (count) => {
    const shuffledNames = [...BOT_NAMES].sort(() => 0.5 - Math.random());
    const shuffledPortraits = [...BANDIT_PORTRAITS].sort(() => 0.5 - Math.random());
    return shuffledNames.slice(0, count).map((name, i) => ({
        id: `bot-${name}-${Math.random()}`,
        name,
        isBot: true,
        portrait: shuffledPortraits[i % shuffledPortraits.length] || '🤨',
        stats: {
            adventurism: 1 + Math.random(),
            luck: 1 + Math.random(),
            teamSpirit: Math.random() * 2,
        }
    }));
};

const calculateReputation = (stats) => {
    if (!stats) return 0;
    return (stats.adventurism * 0.5) + (stats.luck * 0.7) + (stats.teamSpirit * 1);
};

const generateInitialBandits = () => {
    const shuffledNames = [...BOT_NAMES].sort(() => 0.5 - Math.random());
    const shuffledPortraits = [...BANDIT_PORTRAITS].sort(() => 0.5 - Math.random());
    return Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: shuffledNames[i] || `Бандит ${i + 1}`,
        portrait: shuffledPortraits[i] || '🤠',
        gold: 100,
        stats: { adventurism: 1, luck: 1, teamSpirit: 0 },
        progress: { 1: { status: 'unlocked' } } as { [key: number]: { status: string } },
        inventory: {} as { [key: string]: number },
        status: 'free',
        heistStats: { completed: 0, successful: 0, failed: 0 },
        jailedUntil: null,
        jailedAtHeistLevel: null,
        isNpc: false,
    }));
};

// --- COMPONENTS ---

const ThemeToggle = ({ isDarkMode, onToggle }) => (
  <button 
    onClick={onToggle}
    style={{
      ...styles.button,
      width: 'auto',
      padding: '8px 12px',
      fontSize: '20px',
      borderRadius: '50%',
      position: 'relative',
      margin: '0 0 16px 0',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
      zIndex: 1000
    }}
    aria-label="Переключить тему"
  >
    {isDarkMode ? '☀️' : '🌙'}
  </button>
);

const CountdownTimer = ({ expiryTimestamp, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState(expiryTimestamp - Date.now());

    useEffect(() => {
        if (timeLeft <= 0) {
            onExpire();
            return;
        }

        const intervalId = setInterval(() => {
            const newTimeLeft = expiryTimestamp - Date.now();
            if (newTimeLeft <= 0) {
                clearInterval(intervalId);
                onExpire();
            }
            setTimeLeft(newTimeLeft);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [expiryTimestamp, onExpire, timeLeft]);

    if (timeLeft <= 0) {
        return <span>Свободен</span>;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <span>
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
    );
};

const PlayerStats = ({ bandit, totalGold, isDarkMode, onToggleTheme }) => (
    <div style={styles.playerStats}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h3>{bandit.portrait} {bandit.name}</h3>
          </div>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
        </div>
        <div style={{fontWeight: 'bold'}}>
            💰 Золото: {bandit.gold.toFixed(1)} | 🏆 Общее: {totalGold.toFixed(1)}
        </div>
        <div>
            <strong>Репутация:</strong> {calculateReputation(bandit.stats).toFixed(2)}
        </div>
        <div style={styles.playerStatsDetails}>
            <div className="tooltip-container">
                <span style={styles.statItem}>
                    Авантюризм: {bandit.stats.adventurism.toFixed(1)}
                </span>
                <span className="tooltip-text">Повышается за участие в ограблениях</span>
            </div>
            <div className="tooltip-container">
                <span style={styles.statItem}>
                    Удачливость: {bandit.stats.luck.toFixed(1)}
                </span>
                 <span className="tooltip-text">Повышается за успешные ограбления</span>
            </div>
            <div className="tooltip-container">
                <span style={styles.statItem}>
                    Командный дух: {bandit.stats.teamSpirit.toFixed(1)}
                </span>
                <span className="tooltip-text">Повышается за выкуп товарищей из тюрьмы</span>
            </div>
        </div>
    </div>
);

const HeistList = ({ heists, bandit, onSelectHeist, openGangs, onViewOpenGangs }) => {
    if (bandit.status === 'jailed') {
        return (
            <div>
                 <h1 style={styles.title}>Ограбления</h1>
                 <div style={styles.jailedMessage}>
                    🚨 <strong>{bandit.name} в тюрьме!</strong> 🚨<br/>
                    Вы не можете участвовать в ограблениях. Выберите другого бандита на вкладке "Мои бандиты".
                 </div>
            </div>
        )
    }

    return (
    <div>
        <h1 style={styles.title}>Ограбления</h1>
        {heists.map(heist => {
            const progress = bandit.progress[heist.id] || { status: 'locked' };
            const isUnlocked = heist.id === 1 || (bandit.progress[heist.id - 1]?.status === 'leader_complete');
            const accompliceComplete = progress.status === 'accomplice_complete' || progress.status === 'leader_complete';
            const leaderComplete = progress.status === 'leader_complete';
            const gangsForHeist = openGangs.filter(gang => gang.heistId === heist.id);
            const canCreateGang = accompliceComplete && !leaderComplete;

            return (
            <div key={heist.id} style={{...styles.card, ...styles.heistCard, ...(isUnlocked ? {} : { filter: 'grayscale(80%)' })}}>
                {!isUnlocked && <div style={styles.lockedOverlay}>🔒</div>}
                
                <img src={heist.imageUrl} alt={heist.title} style={styles.heistImage} />
                <div style={styles.heistContent}>
                    <h3 style={styles.heistTitle}>{heist.title}</h3>
                    
                    <div style={styles.heistInfo}>
                        <div style={styles.heistStat}>👥<br/>{heist.participants}</div>
                        <div style={styles.heistStat}>💰<br/>{heist.fee} зол.</div>
                        <div style={styles.heistStat}>💸<br/>{heist.prize} зол.</div>
                    </div>

                    <div style={styles.heistProgress}>
                         <div style={{...styles.progressStep, ...(accompliceComplete && styles.progressStepComplete)}}>
                            <span style={{fontSize: '1.5em'}}>🤝</span>
                            <span>{accompliceComplete ? 'Сообщник ✔️' : 'Сообщник'}</span>
                        </div>
                        <div style={{...styles.progressStep, ...(leaderComplete && styles.progressStepComplete), ...(!accompliceComplete && styles.progressStepLocked)}}>
                            <span style={{fontSize: '1.5em'}}>👑</span>
                            <span>{leaderComplete ? 'Главарь ✔️' : 'Главарь'}</span>
                        </div>
                    </div>
                    
                    {isUnlocked && gangsForHeist.length > 0 && (
                        <button 
                            style={{...styles.button, width: '100%', marginBottom: '8px'}}
                            onClick={() => onViewOpenGangs(heist.id)}
                        >
                            Посмотреть банды ({gangsForHeist.length})
                        </button>
                    )}
                    
                    <div style={{...styles.buttonGroup, flexDirection: 'row' as const}}>
                        {gangsForHeist.length === 0 && isUnlocked &&
                            <button 
                                style={{...styles.button, flex: 1}}
                                onClick={() => onSelectHeist(heist.id, 'accomplice')}
                            >
                                Вступить в банду
                            </button>
                        }
                        <button 
                            style={{...styles.button, flex: 1, ...(canCreateGang ? styles.primaryButton : styles.disabledButton)}}
                            disabled={!canCreateGang}
                            onClick={() => onSelectHeist(heist.id, 'leader')}
                        >
                            Создать банду
                        </button>
                    </div>
                </div>
            </div>
        )})}
    </div>
)};

const OpenGangsList = ({ heist, gangs, onJoin, onBack, bandit }) => {
    return (
        <div>
            <h2 style={styles.title}>Открытые банды</h2>
            <h3 style={{...styles.heistTitle, borderBottom: 'none'}}>{heist.title}</h3>
            <div style={styles.card}>
                {gangs.length > 0 ? (
                    <div className="custom-scroll" style={styles.gangsScroller}>
                        <div>
                            {gangs.map(gang => {
                                const totalMembers = 1 + gang.accomplices.length;
                                return (
                                <div key={gang.id} style={styles.openGangItem}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                        <div style={styles.gangIcon}>{gang.icon}</div>
                                        <div style={{flex: 1, minWidth: 0}}>
                                            <div style={styles.gangLeaderName}>
                                                👑 Главарь: {gang.leader.name}
                                            </div>
                                            <div style={styles.gangAccomplicesList}>
                                                Сообщники: {gang.accomplices.map(a => a.name).join(', ') || 'нет'}
                                            </div>
                                            <div style={styles.gangMembersText}>
                                                👥 {totalMembers} / {heist.participants}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        style={{...styles.button, ...styles.primaryButton, ...styles.joinGangButton}}
                                        onClick={() => onJoin(gang.id)}
                                    >
                                        Вступить
                                    </button>
                                </div>
                            )})}
                        </div>
                    </div>
                ) : (
                    <p style={{textAlign: 'center' as const}}>Нет открытых банд для этого ограбления.</p>
                )}
            </div>
            <button style={{...styles.button, ...styles.backButton}} onClick={onBack}>🔙 Назад</button>
        </div>
    );
};


const GangLobby = ({ heist, playerRole, onStartHeist, bandit }) => {
    const [gang, setGang] = useState([]);

    useEffect(() => {
        const botCount = heist.participants - 1;
        const playerMember = { ...bandit, name: `${bandit.name} (Вы)`, isBot: false };
        const botMembers = generateBots(botCount);

        if (playerRole === 'leader') {
            setGang([playerMember, ...botMembers]);
        } else {
            const leaderBot = generateBots(1)[0];
            const otherBots = generateBots(botCount - 1);
            setGang([leaderBot, playerMember, ...otherBots]);
        }
    }, [heist, playerRole, bandit]);

    useEffect(() => {
        if (playerRole === 'leader' && gang.length > 0 && gang.length === heist.participants) {
            const timer = setTimeout(() => { onStartHeist(gang); }, 2000);
            return () => clearTimeout(timer);
        }
    }, [gang, playerRole, onStartHeist, heist]);

    return (
        <div>
            <h2 style={styles.title}>Лобби: {heist.title}</h2>
            <div style={styles.playerRoleText}>Ваша роль: {playerRole === 'leader' ? '👑 Главарь' : '🤝 Сообщник'}</div>
            <div style={styles.card}>
                 <div style={styles.gangMembers}>
                    {gang.map((member, index) => {
                        const isPlayer = !member.isBot;
                        const isLeader = index === 0;
                        const memberRole = isLeader ? 'Главарь' : 'Сообщник';
                        return (
                            <div key={index} style={{ 
                                ...styles.gangMember, 
                                ...(isPlayer ? styles.playerGangMember : {}),
                                ...(isLeader ? styles.gangLeaderMember : {}) 
                            }}>
                                <span style={{fontSize: '1.5em'}}>{member.portrait}</span>
                                <span>{isLeader ? '👑' : '🤝'} {memberRole}: {member.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            {playerRole === 'leader' ? (
                <p style={{textAlign: 'center' as const, fontStyle: 'italic', fontSize: '1.1em', marginTop: '20px'}}>Банда в сборе! Начинаем ограбление...</p>
            ) : (
                <p style={{textAlign: 'center' as const, fontStyle: 'italic'}}>Ожидание начала от главаря...</p>
            )}
        </div>
    );
};

const STORY_SNIPPETS = {
    approach: [
        { icon: '🗺️', text: 'Банда сверяется с картой...', animation: 'animate-burst-in' },
        { icon: '🤫', text: 'Подкрадываются под покровом ночи...', animation: 'animate-slide-in' },
        { icon: '🌳', text: 'Засада у поваленного дерева!', animation: 'animate-burst-in' },
    ],
    action: [
        { icon: '💥', text: 'Завязывается яростная перестрелка!', animation: 'animate-shake' },
        { icon: '🧨', text: 'Динамит делает своё дело!', animation: 'animate-burst-in' },
        { icon: '🔓', text: 'Сейф вскрыт без единого выстрела.', animation: 'animate-slide-in' },
    ],
    complication: [
        { icon: '⭐️', text: 'На горизонте показался шериф!', animation: 'animate-shake' },
        { icon: '🐴', text: 'Лошади напуганы и рвутся вскачь!', animation: 'animate-shake' },
        { icon: '💸', text: 'Мешок с золотом прорвался!', animation: 'animate-burst-in' },
    ],
    getaway: [
        { icon: '🐎', text: 'Уходят от погони!', animation: 'animate-slide-in' },
        { icon: '🌅', text: 'Скрываются в лучах заката...', animation: 'animate-fade-out' },
        { icon: '💰', text: 'Добыча у нас!', animation: 'animate-burst-in' },
    ],
};

const HeistAnimation = ({ onComplete }) => {
    const [story, setStory] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
        
        const generatedStory = [
            getRandomElement(STORY_SNIPPETS.approach),
            getRandomElement(STORY_SNIPPETS.action),
            getRandomElement(STORY_SNIPPETS.complication),
            getRandomElement(STORY_SNIPPETS.getaway),
        ];
        setStory(generatedStory);
    }, []);

    useEffect(() => {
        if (story.length === 0) return;

        if (currentStepIndex >= story.length) {
            const timer = setTimeout(onComplete, 500);
            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1);
        }, 2000); 

        return () => clearTimeout(timer);
    }, [currentStepIndex, story, onComplete]);

    const currentStep = story[currentStepIndex];

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Ограбление!</h2>
            <div style={{...styles.playerRoleText, textAlign: 'center' as const, minHeight: '8em', border: 'none', backgroundColor: 'transparent', boxShadow: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {currentStep && (
                    <div key={currentStepIndex} className={currentStep.animation}>
                        <div style={{fontSize: '3em', marginBottom: '8px'}}>{currentStep.icon}</div>
                        <div style={{fontSize: '1.2em', fontStyle: 'italic'}}>{currentStep.text}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

const LootDistribution = ({ heist, gang, losers }) => {
    const winners = gang.filter(m => !losers.some(l => l.id === m.id));
    const totalPot = heist.fee * losers.length;
    const commission = totalPot * 0.05;
    const distributableLoot = totalPot - commission;
    const individualShare = winners.length > 0 ? distributableLoot / winners.length : 0;

    return (
        <div style={styles.lootDistributionCard}>
            <h3 style={styles.title}>Делёж добычи</h3>
            <div style={styles.lootSummary}>
                <div>Общий куш: <strong>💰 {totalPot.toFixed(1)}</strong></div>
                <div>Комиссия (5%): <strong>🏦 {commission.toFixed(1)}</strong></div>
                <div>К разделу: <strong>💸 {distributableLoot.toFixed(1)}</strong></div>
            </div>
            <hr style={styles.lootDivider} />
            <ul style={styles.lootDistributionList}>
                {winners.map((member: any) => (
                    <li key={member.id} style={styles.lootWinnerItem}>
                        <span>{member.portrait} {member.name}</span>
                        <span>+ {individualShare.toFixed(1)} 💰</span>
                    </li>
                ))}
                {losers.map((member: any) => (
                     <li key={member.id} style={styles.lootLoserItem}>
                        <span>{member.portrait} {member.name}</span>
                        <span>👮‍♂️ Пойман</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

interface HeistResultProps {
    result: {
        success: boolean;
        message: string;
        heist: any;
        gang: { id: any; portrait: React.ReactNode; name: React.ReactNode; }[];
        losers: { id: any; portrait: React.ReactNode; name: React.ReactNode; }[];
    };
}

const HeistResult = ({ result }: HeistResultProps) => {
    const { heist, gang, losers } = result;
    return (
        <div>
            <div style={{...styles.card, ...styles.heistResult, ...(result.success ? styles.success : styles.fail)}}>
                <h2>{result.success ? 'Успех!' : 'Пойман!'}</h2>
                <p>{result.message}</p>
            </div>
            {result.success && heist && gang && losers && (
                <LootDistribution heist={heist} gang={gang} losers={losers} />
            )}
        </div>
    );
};

const Shop = ({ bandit, onPurchase }) => (
    <div>
        <h1 style={styles.title}>Магазин</h1>
        {SHOP_ITEMS.map(item => (
            <div key={item.id} style={{...styles.card, textAlign: 'center' as const, padding: '12px'}}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div style={{...styles.buttonGroup, flexDirection: 'row' as const}}>
                    {item.prices.map(price => (
                        <button key={price.uses} style={{...styles.button, flex:1, ...(bandit.gold < price.cost && styles.disabledButton), padding: '8px 12px'}} onClick={() => onPurchase(item.id, price.cost, price.uses)} disabled={bandit.gold < price.cost}>
                            <div>Купить {price.uses} шт.</div>
                            <div style={{fontWeight: 'bold'}}>{price.cost} 💰</div>
                        </button>
                    ))}
                </div>
            </div>
        ))}
    </div>
);


const Inventory = ({ bandit }) => (
     <div>
        <h1 style={styles.title}>Инвентарь ({bandit.name})</h1>
        <div style={styles.card}>
            {Object.keys(bandit.inventory).length > 0 ? Object.entries(bandit.inventory).map(([key, value]) => {
                 const item = SHOP_ITEMS.find(i => i.id === key);
                 if (!item) return null;
                 return <div key={key} style={{fontSize: '18px', marginBottom: '12px'}}>{item.name}: {value} uses left</div>
            }) : <p>У вас пока нет покупок.</p>}
        </div>
    </div>
);

const MyBandits = ({ bandits, activeBanditId, onSetActive, onBuyBandit, totalGold, onReleaseBandit }) => (
    <div>
        <h1 style={styles.title}>Мои бандиты</h1>
        {bandits.map(bandit => {
            const completedHeists = Object.values(bandit.progress || {}).filter((p: any) =>
                p.status === 'accomplice_complete' || p.status === 'leader_complete'
            ).length;
            const totalHeists = DEFAULT_HEISTS.length;
            const progressPercent = totalHeists > 0 ? (completedHeists / totalHeists) * 100 : 0;

            return (
                <div key={bandit.id} style={{ ...styles.card, ...styles.jailCardGrid, ...(bandit.id === activeBanditId && styles.activeBanditCard) }}>
                    <div style={styles.jailCardHeader}>
                        <span style={styles.jailCardPortrait}>{bandit.portrait}</span>
                        <h4 style={styles.jailCardName}>{bandit.name}</h4>
                    </div>
                    
                    <div style={{...styles.jailCardCell, ...styles.jailCardInfoCell}}>
                        <div style={styles.jailCardInfoText}>💰 Золото: {bandit.gold.toFixed(1)}</div>
                        <div style={styles.jailCardInfoText}>
                            Статус: {bandit.status === 'free'
                                ? <span style={{ color: 'green' }}>Свободен</span>
                                : (
                                    <span style={{ color: 'red' }}>
                                        В тюрьме (<CountdownTimer expiryTimestamp={bandit.jailedUntil} onExpire={() => onReleaseBandit(bandit.id)} />)
                                    </span>
                                )
                            }
                        </div>
                    </div>

                    <div style={{...styles.jailCardCell, ...styles.jailCardActionCell}}>
                        {bandit.status === 'jailed' ? (
                            <span style={{ ...styles.button, ...styles.disabledButton, filter: 'none', width: 'auto', display: 'inline-block', padding: '6px 9px', fontSize: '13px' }}>В тюрьме</span>
                        ) : bandit.id !== activeBanditId ? (
                            <button style={{ ...styles.button, ...styles.primaryButton, width: 'auto', padding: '6px 9px', fontSize: '13px' }} onClick={() => onSetActive(bandit.id)}>
                                Выбрать
                            </button>
                        ) : (
                            <span style={{ ...styles.button, backgroundColor: '#2E7D32', color: 'white', filter: 'none', width: 'auto', display: 'inline-block', padding: '6px 9px', fontSize: '13px', borderColor: 'transparent', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>Активный</span>
                        )}
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
                        <div style={styles.banditProgressContainer}>
                            <div style={{ ...styles.banditProgressBar, width: `${progressPercent}%` }} />
                            <span style={styles.banditProgressText}>Прогресс: {completedHeists} / {totalHeists}</span>
                        </div>
                    </div>
                </div>
            );
        })}
        <button style={{ ...styles.button, width: '100%', marginTop: '20px', ...(totalGold < NEW_BANDIT_COST && styles.disabledButton) }} onClick={onBuyBandit} disabled={totalGold < NEW_BANDIT_COST}>
            Нанять бандита ({NEW_BANDIT_COST} зол.)
        </button>
    </div>
);


const JailView = ({ playerBandits, jailedNpcs, onReleaseBandit, onBailOutNpc, totalGold, activeBandit }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'jailedUntil', direction: 'ascending' });

    const allJailed = useMemo(() => {
        const playerJailed = playerBandits.filter(b => b.status === 'jailed');
        const combined = [...playerJailed, ...jailedNpcs].filter(b => b.jailedUntil && Date.now() < b.jailedUntil);
        
        combined.sort((a: any, b: any) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return combined;
    }, [playerBandits, jailedNpcs, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    return (
        <div>
            <h1 style={styles.title}>Тюрьма</h1>
            <div style={{...styles.card, padding: '8px 16px'}}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                    <button style={{...styles.button, flex: 1}} onClick={() => requestSort('jailedUntil')}>По времени</button>
                    <button style={{...styles.button, flex: 1}} onClick={() => requestSort('jailedAtHeistLevel')}>По уровню</button>
                </div>

                {allJailed.length > 0 ? (
                    <div className="custom-scroll" style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '5px'}}>
                        {allJailed.map(bandit => {
                            const bailInfo = bandit.isNpc ? BAIL_DATA[bandit.jailedAtHeistLevel] : null;
                            const canBail = bailInfo && totalGold >= bailInfo.cost && activeBandit.status !== 'jailed';
                            const bailButtonTitle = activeBandit.status === 'jailed' 
                                ? 'Ваш активный бандит в тюрьме' 
                                : bailInfo && totalGold < bailInfo.cost 
                                ? 'Недостаточно золота' 
                                : '';

                            return (
                                <div key={bandit.id} style={{...styles.card, ...styles.jailCardGrid}}>
                                    <div style={styles.jailCardHeader}>
                                        <span style={styles.jailCardPortrait}>{bandit.portrait}</span>
                                        <h4 style={styles.jailCardName}>🔒 {bandit.name}</h4>
                                    </div>
                                    
                                    <div style={{...styles.jailCardCell, ...styles.jailCardInfoCell}}>
                                        <div style={styles.jailCardInfoText}>Пойман на уровне: {bandit.jailedAtHeistLevel}</div>
                                        <div style={styles.jailCardInfoText}>
                                            Осталось: <CountdownTimer expiryTimestamp={bandit.jailedUntil} onExpire={() => onReleaseBandit(bandit.id)} />
                                        </div>
                                    </div>

                                    <div style={{...styles.jailCardCell, ...styles.jailCardActionCell}}>
                                        {bandit.isNpc && bailInfo ? (
                                            <button 
                                                style={{...styles.button, ...styles.dangerButton, ...styles.jailBailButton, ...(!canBail && styles.disabledButton)}}
                                                onClick={() => onBailOutNpc(bandit.id)}
                                                disabled={!canBail}
                                                title={bailButtonTitle}
                                            >
                                                Выкуп {bailInfo.cost} 💰
                                            </button>
                                        ) : (
                                            <div style={{textAlign: 'center', fontStyle: 'italic', fontSize: '0.9em', padding: '8px'}}>
                                                Свой бандит.<br/>Выкуп невозможен.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p style={{textAlign: 'center' as const}}>В тюрьме пусто. Все бандиты на свободе!</p>
                )}
            </div>
        </div>
    );
};

const Stats = ({ bandit, allBandits }) => {
    const { completed, successful, failed } = bandit.heistStats;
    const successRate = completed > 0 ? ((successful / completed) * 100).toFixed(0) : 0;
    const totalGold = allBandits.reduce((sum, b) => sum + b.gold, 0);
    
    const maxLevel = Math.max(0, ...Object.keys(bandit.progress || {}).map(Number));
    const totalCompleted = allBandits.reduce((sum, b) => sum + b.heistStats.completed, 0);
    const totalSuccessful = allBandits.reduce((sum, b) => sum + b.heistStats.successful, 0);
    const overallSuccessRate = totalCompleted > 0 ? ((totalSuccessful / totalCompleted) * 100).toFixed(0) : 0;
    const sortedBandits = [...allBandits].sort((a, b) => b.gold - a.gold);

    return (
        <div>
            <h1 style={styles.title}>Статистика</h1>
            <div style={styles.card}>
                <h3>Статистика: {bandit.name}</h3>
                
                <div style={styles.statsSection}>
                    <h4>Основные показатели</h4>
                    <p>Заработано золота: <strong>{bandit.gold.toFixed(1)} 💰</strong></p>
                    <p>Максимальный уровень: <strong>⭐ {maxLevel}</strong></p>
                </div>
                
                <div style={styles.statsSection}>
                    <h4>Показатели ограблений</h4>
                    <p>Всего ограблений: <strong>{completed}</strong></p>
                    <p style={{color: 'green'}}>Успешных: <strong>{successful}</strong></p>
                    <p style={{color: 'red'}}>Провальных: <strong>{failed}</strong></p>
                    <p>Процент успеха: <strong>{successRate}%</strong></p>
                </div>

                <div style={styles.statsSection}>
                    <h4>Репутация: {calculateReputation(bandit.stats).toFixed(2)}</h4>
                    <p>Авантюризм: {bandit.stats.adventurism.toFixed(1)}</p>
                    <p>Удачливость: {bandit.stats.luck.toFixed(1)}</p>
                    <p>Командный дух: {bandit.stats.teamSpirit.toFixed(1)}</p>
                </div>
            </div>
             <div style={styles.card}>
                <h3>Сводная статистика</h3>
                <p>Всего бандитов: <strong>{allBandits.length}</strong></p>
                <p>Общее золото: <strong>{totalGold.toFixed(1)} 💰</strong></p>
                
                <div style={styles.statsSection}>
                    <h4>Общие показатели ограблений</h4>
                    <p>Всего ограблений (все бандиты): <strong>{totalCompleted}</strong></p>
                    <p>Общий процент успеха: <strong>{overallSuccessRate}%</strong></p>
                </div>

                <div style={styles.statsSection}>
                    <h4>Вклад бандитов (по золоту)</h4>
                    {sortedBandits.map((b, index) => (
                        <p key={b.id} style={{ margin: '8px 0', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                            {index + 1}. {b.portrait} {b.name}: <strong>{b.gold.toFixed(1)} 💰</strong>
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};


const WelcomeScreen = ({ message, onStartTutorial, onShowRules, onShowCabinet, isDarkMode, onToggleTheme }) => (
    <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
        </div>
        <h1 style={styles.title}>Бандиты Дикого Запада</h1>
        <div style={styles.welcomeMessage}>
            <span style={{ fontSize: '3em', display: 'block', marginBottom: '16px' }}>{message.icon}</span>
            {message.text}
        </div>
        <div style={styles.buttonGroup}>
            <button style={{...styles.button, ...styles.primaryButton}} onClick={onStartTutorial}>👨‍🎓 Учебное ограбление</button>
            <button style={{...styles.button}} onClick={onShowRules}>📝 Правила</button>
            <button style={{...styles.button}} onClick={onShowCabinet}>🔫 К ограблениям</button>
        </div>
    </div>
);

const LevelsSlider = ({ heists }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heists.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + heists.length) % heists.length);
    };

    const currentHeist = heists[currentIndex];

    return (
        <div>
            <h3 style={{textAlign: 'center'}}>Игровые уровни</h3>
            <div style={styles.levelSliderContainer}>
                <button 
                    onClick={handlePrev} 
                    style={{...styles.levelSliderNavArrow, ...styles.levelSliderNavArrowLeft}}
                    aria-label="Previous level"
                >
                    &#x2039;
                </button>
                <div style={styles.levelSliderCard}>
                    <div style={{...styles.levelSliderImage, backgroundImage: `url(${currentHeist.imageUrl})`}}></div>
                    <h4 style={styles.levelSliderTitle}>{currentHeist.title}</h4>
                    <div style={styles.levelSliderInfoContainer}>
                        <div style={styles.levelSliderInfoItem}>
                            <span style={styles.levelSliderInfoIcon}>👥</span>
                            <span>Участники: 1 гл. + {currentHeist.participants - 1}</span>
                        </div>
                         <div style={styles.levelSliderInfoItem}>
                            <span style={styles.levelSliderInfoIcon}>💰</span>
                            <span>Взнос: {currentHeist.fee} зол.</span>
                        </div>
                         <div style={styles.levelSliderInfoItem}>
                            <span style={styles.levelSliderInfoIcon}>💸</span>
                            <span>Куш: {currentHeist.prize} зол.</span>
                        </div>
                         <div style={styles.levelSliderInfoItem}>
                            <span style={styles.levelSliderInfoIcon}>👮‍♂️</span>
                            <span>Пойманы: {currentHeist.sheriffCaptures}</span>
                        </div>
                    </div>
                </div>
                 <button 
                    onClick={handleNext} 
                    style={{...styles.levelSliderNavArrow, ...styles.levelSliderNavArrowRight}}
                    aria-label="Next level"
                >
                   &#x203A;
                </button>
            </div>
        </div>
    );
};

const RulesScreen = ({ onBack, heists }) => {
    const [view, setView] = useState('main');

    const renderContent = () => {
        switch (view) {
            case 'howToStart':
                return <div style={styles.rulesText}>{RULES_CONTENT.howToStart}</div>;
            case 'levels':
                return <LevelsSlider heists={heists} />;
            case 'characteristics':
                return <div style={styles.rulesText}>{RULES_CONTENT.characteristics}</div>;
            case 'finance':
                return <div style={styles.rulesText}>{RULES_CONTENT.finance}</div>;
            default:
                return null;
        }
    };

    return (
        <div style={styles.card}>
            <h1 style={styles.title}>Правила Игры</h1>
            {view === 'main' ? (
                <div style={styles.buttonGroup}>
                    <button style={styles.button} onClick={() => setView('howToStart')}>Как начать игру</button>
                    <button style={{...styles.button}} onClick={() => setView('levels')}>Игровые уровни</button>
                    <button style={{...styles.button}} onClick={() => setView('characteristics')}>Игровые характеристики</button>
                    <button style={{...styles.button}} onClick={() => setView('finance')}>Финансы и прибыль</button>
                    <button style={{...styles.button, marginTop: '20px'}} onClick={onBack}>🔙 Назад</button>
                </div>
            ) : (
                <div>
                    {renderContent()}
                    <button style={{...styles.button, ...styles.backButton}} onClick={() => setView('main')}>🔙 Назад</button>
                </div>
            )}
        </div>
    );
};

const TutorialScreen = ({ onComplete }) => {
    const [step, setStep] = useState('intro');
    const [gang, setGang] = useState([]);
    const [notification, setNotification] = useState('');
    const [message, setMessage] = useState<{ icon: string; text: string; } | null>(null);

    const TUTORIAL_HEIST = { title: "Ограбление зелёного кактуса 🌵", participants: 4 };
    const FAKE_PLAYER = { id: 'player', name: 'Новичок (Вы)', portrait: '🤠', isBot: false };
    
    useEffect(() => {
        if (step === 'intro') {
            setMessage(TUTORIAL_INTRO_MESSAGES[Math.floor(Math.random() * TUTORIAL_INTRO_MESSAGES.length)]);
        } else if (step === 'joinLobby') {
            setGang(generateBots(3));
        } else if (step === 'accompliceSuccess') {
             setTimeout(() => setStep('createPrompt'), 3000);
        } else if (step === 'botsJoining') {
            setGang([FAKE_PLAYER] as any);
            const botNames = generateBots(3);
            let botIndex = 0;
            const interval = setInterval(() => {
                if(botIndex < botNames.length) {
                    const bot = botNames[botIndex];
                    setGang(g => [...g, bot]);
                    setNotification(`К банде присоединился ${bot.name}`);
                    setTimeout(() => setNotification(''), 1900);
                    botIndex++;
                } else {
                    clearInterval(interval);
                    setMessage(TUTORIAL_GANG_FORMED_MESSAGES[Math.floor(Math.random() * TUTORIAL_GANG_FORMED_MESSAGES.length)]);
                    setTimeout(() => { setNotification(''); setStep('leaderHeist') }, 2500);
                }
            }, 2000);
            return () => clearInterval(interval);
        } else if (step === 'leaderSuccess') {
            setTimeout(() => {
                setMessage(TUTORIAL_READY_MESSAGES[Math.floor(Math.random() * TUTORIAL_READY_MESSAGES.length)]);
                setStep('outro');
            }, 3000);
        }
    }, [step]);
    
    const handleJoin = () => {
        const leader = gang[0];
        const accomplices = gang.slice(1);
        setGang([leader, ...accomplices, FAKE_PLAYER] as any);
        setMessage(TUTORIAL_GANG_FORMED_MESSAGES[Math.floor(Math.random() * TUTORIAL_GANG_FORMED_MESSAGES.length)]);
        setTimeout(() => setStep('accompliceHeist'), 3000);
    };

    const renderStep = () => {
        switch(step) {
            case 'intro':
                return (
                    <div style={styles.card}>
                        {message && (
                            <div style={styles.welcomeMessage}>
                                <span style={{ fontSize: '3em', display: 'block', marginBottom: '16px' }}>{message.icon}</span>
                                {message.text}
                            </div>
                        )}
                        <p style={{textAlign: 'center', fontWeight: 'bold'}}>Тебе нужно присоединиться к банде. Жми «Вступить».</p>
                        <button style={{...styles.button, ...styles.primaryButton}} onClick={() => setStep('joinLobby')}>Перейти к банде</button>
                    </div>
                );
            case 'joinLobby':
                return (
                     <div>
                        <h2 style={styles.title}>{TUTORIAL_HEIST.title}</h2>
                        <div style={styles.card}>
                            <div style={styles.gangMembers}>
                                {gang.map((member: any, index) => {
                                    const isLeader = index === 0;
                                    const memberRole = isLeader ? 'Главарь' : 'Сообщник';
                                    return (
                                        <div key={index} style={{
                                            ...styles.gangMember, 
                                            ...(isLeader ? styles.gangLeaderMember : {})
                                        }}>
                                            <span style={{fontSize: '1.5em'}}>{member.portrait}</span>
                                            <span>{isLeader ? '👑' : '🤝'} {memberRole}: {member.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <button style={{...styles.button, ...styles.primaryButton}} onClick={handleJoin}>Вступить</button>
                    </div>
                );
             case 'accompliceHeist':
             case 'leaderHeist':
                 if (message && (step === 'accompliceHeist' || step === 'leaderHeist')) {
                    const heistMessageStyle = {...styles.card, ...styles.welcomeMessage, minHeight: '10em'};
                    return <div style={heistMessageStyle}><span style={{ fontSize: '3em', display: 'block', marginBottom: '16px' }}>{message.icon}</span>{message.text}</div>
                 }
                 return <HeistAnimation onComplete={() => {}} />;
             case 'accompliceSuccess':
                 return <div style={{...styles.card, ...styles.heistResult, ...styles.success}}><h2>🎯 Чистая работа!</h2><p>Поздравляю с первым ограблением! Учебным …🤠.</p></div>;
             case 'createPrompt':
                return <div style={styles.card}><p style={{textAlign: 'center', fontWeight: 'bold'}}>Теперь попробуй себя в роли главаря. Жми «Создать банду».</p><button style={{...styles.button, ...styles.primaryButton}} onClick={() => setStep('botsJoining')}>Создать банду</button></div>
             case 'botsJoining':
                return (
                     <div>
                        <h2 style={styles.title}>{TUTORIAL_HEIST.title}</h2>
                        <div style={styles.card}>
                            {notification && <p style={{textAlign:'center', fontStyle:'italic'}}>{notification}</p>}
                            <div style={styles.gangMembers}>
                                {gang.map((member: any, index) => {
                                    const isPlayer = !member.isBot;
                                    const isLeader = index === 0;
                                    const memberRole = isLeader ? 'Главарь' : 'Сообщник';
                                    return (
                                        <div key={index} style={{
                                            ...styles.gangMember, 
                                            ...(isPlayer ? styles.playerGangMember : {}),
                                            ...(isLeader ? styles.gangLeaderMember : {})
                                        }}>
                                            <span style={{fontSize: '1.5em'}}>{member.portrait}</span>
                                            <span>{isLeader ? '👑' : '🤝'} {memberRole}: {member.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            case 'leaderSuccess':
                return <div style={{...styles.card, ...styles.heistResult, ...styles.success}}><h2>🎯 И снова бинго!</h2><p>Теперь ты умеешь и вступать в банды, и быть главарём!</p></div>;
            case 'outro':
                return (
                     <div style={styles.card}>
                        {message && (
                            <div style={styles.welcomeMessage}>
                                <span style={{ fontSize: '3em', display: 'block', marginBottom: '16px' }}>{message.icon}</span>
                                {message.text}
                            </div>
                        )}
                        <div style={styles.buttonGroup}>
                            <button style={{...styles.button, ...styles.primaryButton}} onClick={() => onComplete('heists')}>🔫 Начать ограбление</button>
                            <button style={{...styles.button}} onClick={() => onComplete('myBandits')}>🏚️ Личный кабинет</button>
                        </div>
                    </div>
                );
            default: return null;
        }
    }
    
    useEffect(() => {
        if (step === 'accompliceHeist') {
            setTimeout(() => setStep('accompliceSuccess'), 8500);
        } else if (step === 'leaderHeist') {
             setTimeout(() => setStep('leaderSuccess'), 8500);
        }
    }, [step]);
    
    return <div>{renderStep()}</div>;
};

const JournalView = ({ journal }) => {
    const formatDate = (date) => {
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div>
            <h1 style={styles.title}>Дневник</h1>
            <div style={{...styles.card, padding: '8px'}}>
                {journal.length > 0 ? (
                    <div className="custom-scroll" style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '8px' }}>
                        {journal.map(entry => (
                            <div key={entry.id} style={{ borderBottom: '1px dashed var(--card-border)', padding: '10px 5px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{ fontSize: '2em' }}>{entry.banditPortrait}</span>
                                <div>
                                    <div style={{ fontSize: '0.8em', color: 'var(--text-color)', opacity: 0.7 }}>
                                        {formatDate(entry.timestamp)} - <strong>{entry.banditName}</strong>
                                    </div>
                                    <div style={{ fontSize: '1em' }}>{entry.message}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', fontStyle: 'italic', padding: '20px' }}>Ваш дневник пока пуст. Пора вершить дела!</p>
                )}
            </div>
        </div>
    );
};

// --- MOCK DATA FOR HALL OF FAME ---
const HALL_OF_FAME_PLAYERS_DATA = [
    { id: 1, name: '@SlickRick', bandits: [
        { name: 'Быстрый Эдди', portrait: '😎', gold: 5500, heistStats: { completed: 50 }, progress: { 10: {status: 'leader_complete'} }, stats: { adventurism: 45, luck: 55, teamSpirit: 30 } },
        { name: 'Одноглазый Джек', portrait: '🧐', gold: 3200, heistStats: { completed: 30 }, progress: { 8: {status: 'leader_complete'} }, stats: { adventurism: 30, luck: 25, teamSpirit: 15 } }
    ]},
    { id: 2, name: '@CalamityJane', bandits: [
         { name: 'Рыжая Соня', portrait: '👩‍🦰', gold: 8100, heistStats: { completed: 65 }, progress: { 10: {status: 'leader_complete'} }, stats: { adventurism: 60, luck: 70, teamSpirit: 50 } }
    ]},
    { id: 3, name: '@WyattEarp', bandits: [
        { name: 'Док Холлидей', portrait: '🥸', gold: 7200, heistStats: { completed: 55 }, progress: { 9: {status: 'leader_complete'} }, stats: { adventurism: 50, luck: 60, teamSpirit: 40 } }
    ]},
    { id: 4, name: '@BillyTheKid', bandits: [
        { name: 'Малыш Билли', portrait: '🤠', gold: 9500, heistStats: { completed: 80 }, progress: { 10: {status: 'leader_complete'} }, stats: { adventurism: 80, luck: 90, teamSpirit: 20 } }
    ]},
    { id: 5, name: '@JesseJames', bandits: [
        { name: 'Фрэнк Джеймс', portrait: '😠', gold: 6800, heistStats: { completed: 60 }, progress: { 10: {status: 'leader_complete'} }, stats: { adventurism: 55, luck: 65, teamSpirit: 45 } },
        { name: 'Коул Янгер', portrait: '🧔‍♂️', gold: 4100, heistStats: { completed: 40 }, progress: { 7: {status: 'leader_complete'} }, stats: { adventurism: 35, luck: 30, teamSpirit: 25 } }
    ]},
    { id: 6, name: '@ButchCassidy', bandits: [
        { name: 'Сандэнс Кид', portrait: '😏', gold: 8800, heistStats: { completed: 70 }, progress: { 10: {status: 'leader_complete'} }, stats: { adventurism: 70, luck: 80, teamSpirit: 60 } }
    ]},
    { id: 7, name: '@BelleStarr', bandits: [
        { name: 'Королева бандитов', portrait: '💃', gold: 7500, heistStats: { completed: 62 }, progress: { 9: {status: 'leader_complete'} }, stats: { adventurism: 65, luck: 75, teamSpirit: 55 } }
    ]},
    { id: 8, name: '@WildBill', bandits: [
        { name: 'Дикий Билл', portrait: '🤨', gold: 6300, heistStats: { completed: 58 }, progress: { 8: {status: 'leader_complete'} }, stats: { adventurism: 52, luck: 62, teamSpirit: 42 } }
    ]},
    { id: 9, name: '@JohnnyRingo', bandits: [
        { name: 'Джонни Ринго', portrait: '💀', gold: 5900, heistStats: { completed: 53 }, progress: { 9: {status: 'leader_complete'} }, stats: { adventurism: 48, luck: 58, teamSpirit: 38 } }
    ]},
    { id: 10, name: '@TheLoneRanger', bandits: [
        { name: 'Одинокий рейнджер', portrait: '🤠', gold: 10000, heistStats: { completed: 90 }, progress: { 10: {status: 'leader_complete'} }, stats: { adventurism: 90, luck: 100, teamSpirit: 80 } }
    ]},
];

const HallOfFameView = () => {
    const [activeTab, setActiveTab] = useState('players');
    type SortByType = 'gold' | 'heists' | 'level' | 'reputation';
    const [sortBy, setSortBy] = useState<SortByType>('gold');

    const processedData = useMemo(() => {
        const players = HALL_OF_FAME_PLAYERS_DATA.map(player => {
            const totalGold = player.bandits.reduce((sum, b) => sum + b.gold, 0);
            const totalHeists = player.bandits.reduce((sum, b) => sum + b.heistStats.completed, 0);
            const maxLevel = Math.max(...player.bandits.map(b => 
                Math.max(0, ...Object.keys(b.progress).map(Number))
            ));
            const totalReputation = player.bandits.reduce((sum, b) => sum + calculateReputation(b.stats), 0);
            return { id: player.id, name: player.name, gold: totalGold, heists: totalHeists, level: maxLevel, reputation: totalReputation };
        });

        const bandits = HALL_OF_FAME_PLAYERS_DATA.flatMap(player => 
            player.bandits.map(bandit => ({
                ...bandit,
                ownerName: player.name,
                gold: bandit.gold,
                heists: bandit.heistStats.completed,
                level: Math.max(0, ...Object.keys(bandit.progress).map(Number)),
                reputation: calculateReputation(bandit.stats)
            }))
        );

        const sortFunction = (a, b) => {
            if (sortBy === 'level') return b.level - a.level || b.reputation - a.reputation;
            return b[sortBy] - a[sortBy];
        };

        players.sort(sortFunction);
        bandits.sort(sortFunction);

        return { players: players.slice(0, 10), bandits: bandits.slice(0, 10) };
    }, [sortBy]);

    const dataToShow = activeTab === 'players' ? processedData.players : processedData.bandits;

    return (
        <div>
            <h1 style={styles.title}>Зал славы</h1>
            <div style={{ ...styles.card, paddingBottom: '8px' }}>
                <div style={{ display: 'flex', borderBottom: '2px solid var(--card-border)', marginBottom: '16px' }}>
                    <button style={{ ...styles.button, flex: 1, borderRadius: '4px 4px 0 0', marginBottom: '-2px', borderBottom: 'none', ...(activeTab === 'players' ? styles.primaryButton : {}) }} onClick={() => setActiveTab('players')}>Лучшие игроки</button>
                    <button style={{ ...styles.button, flex: 1, borderRadius: '4px 4px 0 0', marginBottom: '-2px', borderBottom: 'none', ...(activeTab === 'bandits' ? styles.primaryButton : {}) }} onClick={() => setActiveTab('bandits')}>Лучшие бандиты</button>
                </div>
                
                <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                    <label style={{ marginRight: '8px', fontFamily: "'Rye', cursive" }}>Сортировать:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortByType)} style={{ fontFamily: "'Rye', cursive", padding: '5px', background: 'var(--input-bg)', color: 'var(--text-color)', border: '2px solid var(--card-border)' }}>
                        <option value="gold">По величине куша</option>
                        <option value="heists">По кол-ву ограблений</option>
                        <option value="level">По макс. уровню</option>
                        <option value="reputation">По репутации</option>
                    </select>
                </div>

                <div className="custom-scroll" style={{maxHeight: '400px', overflowY: 'auto'}}>
                    {dataToShow.map((item: any, index) => (
                        <div key={item.id || item.name} style={{ display: 'flex', alignItems: 'center', padding: '10px', gap: '10px', backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent' }}>
                            <div style={{ fontSize: '1.5em', fontFamily: "'Rye', cursive", minWidth: '35px', textAlign: 'center' }}>{index + 1}.</div>
                            {activeTab === 'bandits' && <div style={{ fontSize: '2em' }}>{item.portrait}</div>}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                {activeTab === 'bandits' && <div style={{ fontSize: '0.8em', fontStyle: 'italic', opacity: 0.7 }}>Игрок: {item.ownerName}</div>}
                            </div>
                            <div style={{ textAlign: 'right', fontFamily: "'Rye', cursive" }}>
                                {
                                    {
                                        gold: `💰 ${item.gold.toFixed(0)}`,
                                        heists: `🔫 ${item.heists}`,
                                        level: `⭐ ${item.level}`,
                                        reputation: `🏆 ${item.reputation.toFixed(2)}`,
                                    }[sortBy]
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AdminView = ({ heists, onImageUpload }) => {
    const [selectedHeistId, setSelectedHeistId] = useState(heists[0]?.id || 1);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedHeistId && previewUrl) {
            onImageUpload(selectedHeistId, previewUrl);
            alert(`Изображение для уровня "${heists.find(h => h.id === selectedHeistId)?.title}" обновлено.`);
            setSelectedFile(null);
            setPreviewUrl(null);
            // Reset file input value
            const fileInput = document.getElementById('heist-image-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } else {
            alert('Пожалуйста, выберите уровень и файл изображения.');
        }
    };

    return (
        <div>
            <h1 style={styles.title}>Админка</h1>
            <div style={styles.card}>
                <h3 style={{...styles.title, marginTop: 0}}>Загрузить изображение для уровня</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label htmlFor="heist-select" style={{ display: 'block', marginBottom: '8px' }}>Выберите уровень:</label>
                        <select
                            id="heist-select"
                            value={selectedHeistId}
                            onChange={(e) => setSelectedHeistId(Number(e.target.value))}
                            style={{ width: '100%', padding: '8px', fontFamily: "'Merriweather', serif", backgroundColor: 'var(--input-bg)', color: 'var(--text-color)', border: '2px solid var(--card-border)' }}
                        >
                            {heists.map(heist => (
                                <option key={heist.id} value={heist.id}>{heist.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="heist-image-upload" style={{ display: 'block', marginBottom: '8px' }}>Выберите файл:</label>
                        <input
                            id="heist-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ fontFamily: "'Merriweather', serif" }}
                        />
                    </div>
                    {previewUrl && (
                        <div>
                            <p style={{ margin: '0 0 8px 0' }}>Предпросмотр:</p>
                            <img src={previewUrl} alt="Предпросмотр" style={{ maxWidth: '100%', height: 'auto', maxHeight: '150px', borderRadius: '4px', border: '2px solid var(--card-border)' }} />
                        </div>
                    )}
                    <button type="submit" style={{...styles.button, ...styles.primaryButton}}>Загрузить</button>
                </form>
            </div>
            <div style={styles.card}>
                 <h3 style={{...styles.title, marginTop: 0}}>Текущие изображения уровней</h3>
                 <div className="custom-scroll" style={{maxHeight: '400px', overflowY: 'auto'}}>
                    {heists.map(heist => (
                        <div key={heist.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px dashed var(--card-border)', padding: '8px 0' }}>
                            <img src={heist.imageUrl} alt={heist.title} style={{ width: '100px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                            <span style={{flex: 1}}>{heist.title}</span>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

const App = () => {
    const [gameState, setGameState] = useState('welcome'); 
    const [view, setView] = useState('heists'); 
    const [activeHeistId, setActiveHeistId] = useState(null);
    const [heistGang, setHeistGang] = useState([]);
    const [playerRole, setPlayerRole] = useState(null);
    type HeistResultType = {
        success: boolean;
        message: string;
        heist: any;
        gang: { id: any; portrait: React.ReactNode; name: React.ReactNode; }[];
        losers: { id: any; portrait: React.ReactNode; name: React.ReactNode; }[];
    };
    const [heistResult, setHeistResult] = useState<HeistResultType | null>(null);
    const [openGangs, setOpenGangs] = useState([]);
    const [jailedNpcs, setJailedNpcs] = useState([]);
    const [viewingGangsForHeistId, setViewingGangsForHeistId] = useState(null);
    const [welcomeMessage, setWelcomeMessage] = useState({ icon: '', text: '' });
    const [journal, setJournal] = useState([] as any[]);
    const [isDarkMode, setIsDarkMode] = useState(() => {
      const saved = localStorage.getItem('isDarkMode');
      return saved === 'true';
    });
    const [heists, setHeists] = useState(DEFAULT_HEISTS);

    const [player, setPlayer] = useState({
        activeBanditId: 1,
        bandits: generateInitialBandits(),
    });

    const activeBandit = useMemo(() => player.bandits.find(b => b.id === player.activeBanditId)!, [player.bandits, player.activeBanditId]);
    const totalGold = useMemo(() => player.bandits.reduce((sum, b) => sum + b.gold, 0), [player.bandits]);
    
    useEffect(() => {
      if (isDarkMode) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
      localStorage.setItem('isDarkMode', isDarkMode.toString());
    }, [isDarkMode]);

    const addJournalEntry = (bandit, message) => {
        const newEntry = {
            id: Date.now() + Math.random(),
            timestamp: new Date(),
            banditName: bandit.name,
            banditPortrait: bandit.portrait,
            message: message,
        };
        setJournal(prev => [newEntry, ...prev]);
    };

    useEffect(() => {
        try {
            const savedHeists = localStorage.getItem('gameHeists');
            if (savedHeists) {
                setHeists(JSON.parse(savedHeists));
            }
        } catch (error) {
            console.error("Failed to load heists from localStorage", error);
        }

        setWelcomeMessage(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
        
        const now = Date.now();
        setJailedNpcs([
            { id: 'npc1', name: 'Бедолага Боб', portrait: '😥', status: 'jailed', jailedUntil: now + 12 * 60 * 60 * 1000, jailedAtHeistLevel: 2, isNpc: true },
            { id: 'npc2', name: 'Невезучий Сэм', portrait: '😫', status: 'jailed', jailedUntil: now + 23 * 60 * 60 * 1000, jailedAtHeistLevel: 1, isNpc: true },
        ] as any);

        const allGangs: any[] = [];
        let iconHistory = ['', ''];
    
        DEFAULT_HEISTS.forEach(heist => {
            for (let i = 0; i < 5; i++) {
                let nextIcon;
                do {
                    nextIcon = GANG_ICONS[Math.floor(Math.random() * GANG_ICONS.length)];
                } while (nextIcon === iconHistory[0] && nextIcon === iconHistory[1]);
    
                iconHistory.push(nextIcon);
                iconHistory.shift();
                
                const accompliceCount = 1 + Math.floor(Math.random() * (heist.participants - 2));
                const accomplices = generateBots(accompliceCount);
                const leader = generateBots(1)[0];
    
                allGangs.push({
                    id: `${heist.id}-${i}`,
                    heistId: heist.id,
                    leader: leader,
                    accomplices: accomplices,
                    icon: nextIcon
                });
            }
        });
        setOpenGangs(allGangs as any);

        const jailCheckInterval = setInterval(() => {
            setPlayer(p => {
                let changed = false;
                const updatedBandits = p.bandits.map(b => {
                    if (b.status === 'jailed' && b.jailedUntil && Date.now() > b.jailedUntil) {
                        changed = true;
                        return { ...b, status: 'free', jailedUntil: null, jailedAtHeistLevel: null };
                    }
                    return b;
                });
                return changed ? { ...p, bandits: updatedBandits as any } : p;
            });
            setJailedNpcs(npcs => {
                const updatedNpcs = npcs.filter((n: any) => n.jailedUntil && Date.now() < n.jailedUntil);
                return updatedNpcs.length === npcs.length ? npcs : updatedNpcs;
            })
        }, 10000); 

        return () => {
            clearInterval(jailCheckInterval);
        };
    }, []);


    const handleSelectHeist = (heistId, role) => {
        const heist = heists.find(h => h.id === heistId);
        if (!heist) return;

        if (activeBandit.gold < heist.fee) {
            alert("На вашем счету недостаточно средств для участия в ограблении. Пожалуйста, пополните баланс.");
            return;
        }

        setPlayer(p => ({
            ...p,
            bandits: p.bandits.map(b =>
                b.id === p.activeBanditId ? { ...b, gold: b.gold - heist.fee } : b
            )
        }));

        setActiveHeistId(heistId);
        setPlayerRole(role);
        setView('gangLobby');
    };
    
    const calculateAndShowHeistResult = () => {
        const heist = heists.find(h => h.id === activeHeistId)!;
        const gang = heistGang;
    
        let catchableMembers = gang.filter((_, index) => index !== 0);
    
        const playerMemberInGang: any = catchableMembers.find((m: any) => !m.isBot);
        const itemsToUse = {
            whiskers: false,
            horseshoe: false,
        };
    
        if (playerMemberInGang) {
            const inventory = playerMemberInGang.inventory;
            if (inventory) {
                if (inventory.whiskers > 0) {
                    itemsToUse.whiskers = true;
                }
                if (inventory.horseshoe > 0) {
                    itemsToUse.horseshoe = true;
                }
            }
        }
    
        let losers: any[] = [];
        const captures = Math.min(heist.sheriffCaptures, catchableMembers.length);
    
        for (let i = 0; i < captures; i++) {
            if (catchableMembers.length === 0) break;
    
            const membersWithReputation = catchableMembers.map((member: any) => {
                const baseReputation = calculateReputation(member.stats);
                let effectiveReputation = baseReputation;
    
                if (!member.isBot) {
                    if (itemsToUse.whiskers) {
                        effectiveReputation *= 1.10;
                    }
                    if (itemsToUse.horseshoe) {
                        effectiveReputation *= 1.20;
                    }
                }
                return { ...member, reputation: effectiveReputation };
            });
    
            const minReputation = Math.min(...membersWithReputation.map(m => m.reputation));
            const potentialLosers = membersWithReputation.filter(m => m.reputation === minReputation);
            
            const loserIndexInPotential = Math.floor(Math.random() * potentialLosers.length);
            const chosenLoser = potentialLosers[loserIndexInPotential];
            losers.push(chosenLoser);
    
            catchableMembers = catchableMembers.filter((member: any) => member.id !== chosenLoser.id);
        }
    
        const playerLost = losers.some(l => !l.isBot);
        const winners = gang.filter((m: any) => !losers.some(l => l.id === m.id));
        const totalPot = heist.fee * losers.length;
        const commission = totalPot * 0.05;
        const distributableLoot = totalPot - commission;
        const individualShare = winners.length > 0 ? distributableLoot / winners.length : 0;
        let resultMessage = '';
    
        if (playerLost) {
            const randomMessage = FAILURE_MESSAGES[Math.floor(Math.random() * FAILURE_MESSAGES.length)];
            resultMessage = `${randomMessage} Вы потеряли свой взнос в ${heist.fee} золотых.`;
            addJournalEntry(activeBandit, `был пойман при ограблении "${heist.title}" и потерял ${heist.fee} золота.`);
        } else {
            resultMessage = `Ограбление прошло успешно! Ваша доля: ${individualShare.toFixed(1)} золотых.`;
            addJournalEntry(activeBandit, `успешно ограбил "${heist.title}" и получил ${individualShare.toFixed(1)} золота.`);
        }
    
        setPlayer(p => ({
            ...p,
            bandits: p.bandits.map(b => {
                if (b.id !== p.activeBanditId) return b;
                
                let updatedBandit = {...b};
                
                if (playerMemberInGang) {
                    const newInventory = { ...updatedBandit.inventory };
                    let itemsConsumed = false;
                    if (itemsToUse.whiskers) {
                        newInventory.whiskers = Math.max(0, (newInventory.whiskers || 0) - 1);
                        itemsConsumed = true;
                    }
                    if (itemsToUse.horseshoe) {
                        newInventory.horseshoe = Math.max(0, (newInventory.horseshoe || 0) - 1);
                        itemsConsumed = true;
                    }
                    if (itemsConsumed) {
                        updatedBandit.inventory = newInventory;
                    }
                }
    
                if(playerLost) {
                    updatedBandit = {
                        ...updatedBandit,
                        stats: { ...updatedBandit.stats, adventurism: updatedBandit.stats.adventurism + 1 },
                        status: 'jailed',
                        jailedUntil: Date.now() + 24 * 60 * 60 * 1000,
                        jailedAtHeistLevel: heist.id,
                        heistStats: { ...updatedBandit.heistStats, completed: updatedBandit.heistStats.completed + 1, failed: updatedBandit.heistStats.failed + 1 }
                    } as any;
                } else {
                    updatedBandit = {
                        ...updatedBandit,
                        gold: updatedBandit.gold + individualShare,
                        stats: { ...updatedBandit.stats, adventurism: updatedBandit.stats.adventurism + 1, luck: updatedBandit.stats.luck + 1 },
                        progress: { ...updatedBandit.progress, [heist.id]: { status: playerRole === 'leader' ? 'leader_complete' : 'accomplice_complete' } },
                        heistStats: { ...updatedBandit.heistStats, completed: updatedBandit.heistStats.completed + 1, successful: updatedBandit.heistStats.successful + 1 }
                    } as any;
                }
                return updatedBandit;
            })
        }));
        
        setHeistResult({ success: !playerLost, message: resultMessage, heist, gang, losers });
        setView('heistResult');
    };

    const handleStartHeist = (gang) => {
        setHeistGang(gang);
        setView('heistAnimation');
    };

    const handleJoinOpenGang = (gangId) => {
        const gangToJoin: any = openGangs.find((g: any) => g.id === gangId);
        if (!gangToJoin) return;
        const heist = heists.find(h => h.id === gangToJoin.heistId);
        if (!heist) return;

        if (activeBandit.gold < heist.fee) {
            alert('На вашем счету недостаточно средств для вступления в банду. Пожалуйста, пополните баланс.');
            return;
        }

        setPlayer(p => ({
            ...p,
            bandits: p.bandits.map(b =>
                b.id === p.activeBanditId ? { ...b, gold: b.gold - heist.fee } : b
            )
        }));

        const playerMember = { ...activeBandit, name: `${activeBandit.name} (Вы)`, isBot: false };
        const fullGang = [gangToJoin.leader, ...gangToJoin.accomplices, playerMember];
        setOpenGangs(currentGangs => currentGangs.filter((g: any) => g.id !== gangId));
        
        setActiveHeistId(gangToJoin.heistId);
        setPlayerRole('accomplice');
        handleStartHeist(fullGang);
    };

    const handlePurchase = (itemId, cost, uses) => {
        if (activeBandit.gold >= cost) {
            const item = SHOP_ITEMS.find(i => i.id === itemId);
            setPlayer(p => ({...p, bandits: p.bandits.map(b => b.id === p.activeBanditId ? {
                ...b,
                gold: b.gold - cost,
                inventory: { ...b.inventory, [itemId]: (b.inventory[itemId] || 0) + uses }
            } : b)}));
            addJournalEntry(activeBandit, `купил "${item?.name}" (${uses} шт.) за ${cost} золота.`);
            alert(`Вы купили ${item?.name}!`);
        }
    };

    const handleSetActiveBandit = (banditId) => {
        setPlayer(p => ({ ...p, activeBanditId: banditId }));
    };

    const handleReleaseBandit = (banditId) => {
        setPlayer(p => ({
            ...p,
            bandits: p.bandits.map(b => 
                b.id === banditId && b.status === 'jailed'
                ? { ...b, status: 'free', jailedUntil: null, jailedAtHeistLevel: null } 
                : b
            ) as any,
        }));
        setJailedNpcs(npcs => npcs.filter((n: any) => n.id !== banditId));
    };

    const handleBailOutNpc = (npcId) => {
        const npc: any = jailedNpcs.find((n: any) => n.id === npcId);
        if (!npc) return;

        const bailInfo = BAIL_DATA[npc.jailedAtHeistLevel];
        if (!bailInfo || totalGold < bailInfo.cost) {
            alert('Недостаточно золота для выкупа!');
            return;
        }
        
        if (activeBandit.status === 'jailed') {
            alert('Ваш активный бандит в тюрьме и не может выкупать других!');
            return;
        }

        setPlayer(p => {
            let costLeft = bailInfo.cost;
            const banditsAfterPayment = p.bandits.map(b => {
                if (costLeft > 0 && b.gold > 0) {
                    const payment = Math.min(b.gold, costLeft);
                    costLeft -= payment;
                    return { ...b, gold: b.gold - payment };
                }
                return b;
            });
            
            const banditsAfterBonus = banditsAfterPayment.map(b => ({
                ...b,
                stats: { ...b.stats, teamSpirit: b.stats.teamSpirit + bailInfo.teamSpirit }
            }));

            return { ...p, bandits: banditsAfterBonus as any };
        });

        setJailedNpcs(npcs => npcs.filter((n: any) => n.id !== npcId));
        addJournalEntry(activeBandit, `выкупил ${npc.name} из тюрьмы за ${bailInfo.cost} золота, повысив командный дух.`);
        alert(`Вы выкупили ${npc.name}! Командный дух вашей банды вырос на ${bailInfo.teamSpirit}.`);
    };

    const handleBuyBandit = () => {
        if (totalGold < NEW_BANDIT_COST) {
             alert('Недостаточно общего золота для найма!');
             return;
        }
        
        const usedPortraits = player.bandits.map(b => b.portrait);
        const availablePortraits = BANDIT_PORTRAITS.filter(p => !usedPortraits.includes(p));
        const newPortrait = availablePortraits.length > 0
            ? availablePortraits[Math.floor(Math.random() * availablePortraits.length)]
            : BANDIT_PORTRAITS[Math.floor(Math.random() * BANDIT_PORTRAITS.length)];

        const newBandit = {
            id: player.bandits.length + 1,
            name: BOT_NAMES[player.bandits.length % BOT_NAMES.length] || `Бандит ${player.bandits.length + 1}`,
            portrait: newPortrait,
            gold: 0,
            stats: { adventurism: 1, luck: 1, teamSpirit: 0 },
            progress: { 1: { status: 'unlocked' } } as { [key: number]: { status: string } },
            inventory: {} as { [key: string]: number },
            status: 'free',
            heistStats: { completed: 0, successful: 0, failed: 0 },
            jailedUntil: null,
            jailedAtHeistLevel: null,
            isNpc: false,
        };

        setPlayer(p => {
            let costLeft = NEW_BANDIT_COST;
            const updatedBandits = p.bandits.map(b => {
                if (costLeft > 0 && b.gold > 0) {
                    const payment = Math.min(b.gold, costLeft);
                    costLeft -= payment;
                    return { ...b, gold: b.gold - payment };
                }
                return b;
            });
            return { ...p, bandits: [...updatedBandits, newBandit] as any }
        });

        alert(`Вы наняли нового бандита: ${newBandit.name}!`);
    };

    const handleHeistImageUpload = (heistId, imageDataUrl) => {
        const updatedHeists = heists.map(h => 
            h.id === heistId ? { ...h, imageUrl: imageDataUrl } : h
        );
        setHeists(updatedHeists);
        localStorage.setItem('gameHeists', JSON.stringify(updatedHeists));
    };

    const navigate = (newView) => {
        setHeistResult(null);
        setActiveHeistId(null);
        setPlayerRole(null);
        setViewingGangsForHeistId(null);
        setView(newView);
    };

    const handleViewOpenGangs = (heistId) => {
        setViewingGangsForHeistId(heistId);
        setView('openGangsList');
    };

    const handleStartTutorial = () => {
        setGameState('tutorial');
    };

    const handleCompleteTutorial = (targetView = 'heists') => {
        setGameState('main_game');
        navigate(targetView);
    };

    const renderGameView = () => {
        switch (view) {
            case 'heistAnimation': return <HeistAnimation onComplete={calculateAndShowHeistResult} />;
            case 'gangLobby':
                const heist = heists.find(h => h.id === activeHeistId)!;
                return <GangLobby heist={heist} playerRole={playerRole} onStartHeist={handleStartHeist} bandit={activeBandit} />;
            case 'heistResult':
                if (!heistResult) {
                    return null;
                }
                return (
                    <div>
                        <HeistResult result={heistResult} />
                        <button style={{...styles.button, width: '100%', marginTop: '20px'}} onClick={() => navigate('heists')}>Продолжить</button>
                    </div>
                );
            case 'openGangsList':
                const heistForGangs = heists.find(h => h.id === viewingGangsForHeistId)!;
                const gangsForHeist = openGangs.filter((g: any) => g.heistId === viewingGangsForHeistId);
                return <OpenGangsList 
                    heist={heistForGangs} 
                    gangs={gangsForHeist} 
                    onJoin={handleJoinOpenGang} 
                    onBack={() => navigate('heists')}
                    bandit={activeBandit}
                />;
            case 'shop': return <Shop bandit={activeBandit} onPurchase={handlePurchase} />;
            case 'inventory': return <Inventory bandit={activeBandit}/>;
            case 'stats': return <Stats bandit={activeBandit} allBandits={player.bandits}/>;
            case 'myBandits': return <MyBandits bandits={player.bandits} activeBanditId={player.activeBanditId} onSetActive={handleSetActiveBandit} onBuyBandit={handleBuyBandit} totalGold={totalGold} onReleaseBandit={handleReleaseBandit}/>;
            case 'jail': return <JailView playerBandits={player.bandits} jailedNpcs={jailedNpcs} onReleaseBandit={handleReleaseBandit} onBailOutNpc={handleBailOutNpc} totalGold={totalGold} activeBandit={activeBandit}/>;
            case 'journal': return <JournalView journal={journal} />;
            case 'hallOfFame': return <HallOfFameView />;
            case 'admin': return <AdminView heists={heists} onImageUpload={handleHeistImageUpload} />;
            case 'heists':
            default:
                return <HeistList heists={heists} bandit={activeBandit} onSelectHeist={handleSelectHeist} openGangs={openGangs} onViewOpenGangs={handleViewOpenGangs}/>;
        }
    };
    
    if (gameState === 'welcome') {
        return <WelcomeScreen 
            message={welcomeMessage} 
            onStartTutorial={handleStartTutorial}
            onShowRules={() => setGameState('rules')}
            onShowCabinet={() => setGameState('main_game')}
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
    }

    if (gameState === 'rules') {
        return <RulesScreen onBack={() => setGameState('welcome')} heists={heists} />
    }
    
    if (gameState === 'tutorial') {
        return <TutorialScreen onComplete={handleCompleteTutorial} />
    }

    const isMainView = ['heists', 'shop', 'inventory', 'stats', 'myBandits', 'jail', 'journal', 'hallOfFame', 'admin'].includes(view);
    const activeTab = ['heists', 'gangLobby', 'heistResult', 'openGangsList', 'heistAnimation'].includes(view) ? 'heists' : view;

    return (
        <div>
            <PlayerStats 
              bandit={activeBandit} 
              totalGold={totalGold} 
              isDarkMode={isDarkMode} 
              onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
            />
            <div style={styles.mainNav}>
                <button style={{...styles.button, ...styles.navButton, ...(activeTab === 'heists' && styles.primaryButton)}} onClick={() => navigate('heists')}>💰 Ограбления</button>
                <button style={{...styles.button, ...styles.navButton, ...(activeTab === 'myBandits' && styles.primaryButton)}} onClick={() => navigate('myBandits')}>🤠 Мои бандиты</button>
                <button style={{...styles.button, ...styles.navButton, ...(activeTab === 'jail' && styles.primaryButton)}} onClick={() => navigate('jail')}>⛓️ Тюрьма</button>
                <button style={{...styles.button, ...styles.navButton, ...(activeTab === 'shop' && styles.primaryButton)}} onClick={() => navigate('shop')}>🛒 Магазин</button>
                <button style={{...styles.button, ...styles.navButton, ...(activeTab === 'journal' && styles.primaryButton)}} onClick={() => navigate('journal')}>📜 Дневник</button>
                <button style={{...styles.button, ...styles.navButton, ...(activeTab === 'stats' && styles.primaryButton)}} onClick={() => navigate('stats')}>📊 Статистика</button>
                <button style={{...styles.button, ...styles.navButton, ...(activeTab === 'hallOfFame' && styles.primaryButton)}} onClick={() => navigate('hallOfFame')}>🏆 Зал славы</button>
                <button style={{...styles.button, ...styles.navButton, ...(view === 'admin' && styles.primaryButton)}} onClick={() => navigate('admin')}>⚙️ Админка</button>
            </div>

            {isMainView && view !== 'heists' && (
                <button 
                    style={{...styles.button, width: '100%', marginBottom: '20px' }} 
                    onClick={() => navigate('heists')}
                >
                    🔙 К ограблениям
                </button>
            )}

            {renderGameView()}
            
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);