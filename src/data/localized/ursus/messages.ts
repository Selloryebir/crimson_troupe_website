import type { LocalizedShape } from '../schema';
import type { yanMessages } from '../yan/messages';
import type { yanTicketingPlatforms } from '../yan/messages';

export const ursusTicketingPlatforms = {
  'rice-network': { displayName: 'Рисовая сеть', logoAlt: 'Временный знак Рисовой сети' },
  'drop-tower': { displayName: 'Башня падения', logoAlt: 'Временный знак Башни падения' },
} as const satisfies LocalizedShape<typeof yanTicketingPlatforms>;

export const ursusMessages = {
  filters: {
    city: 'Город',
    allCities: 'Все города',
    month: 'Месяц',
    allMonths: 'Все месяцы',
    monthOption: 'Месяц {month}',
    reset: 'Сбросить фильтры',
    count: 'Спектаклей: {count}',
    empty: 'Ни один спектакль не соответствует фильтрам. Выберите другой город или месяц.',
  },
  search: {
    label: 'Поиск по этому сайту',
    submit: 'Найти',
    scope: 'Область поиска: {scope}',
    unavailable: 'Поисковый индекс временно недоступен. Продолжите с главной навигации.',
    prompt: 'Введите запрос для поиска спектаклей, постановок и страниц.',
    minimumQuery: 'Введите не менее {count} символов.',
    resultCount: 'Найдено результатов: {count}.',
    noResults: 'Подходящих материалов не найдено.',
    noscriptTitle: 'Для поиска требуется JavaScript',
    noscriptCopy:
      'Страница не отправляет запрос и не загружает удалённую службу. Спектакли и сведения о театре доступны через навигацию.',
  },
  ticketing: {
    partnerPageEyebrow: 'ОФИЦИАЛЬНЫЙ БИЛЕТНЫЙ ПАРТНЁР',
    partnerPageTitle: 'Сервис мест: {platform}',
    partnerPageIntroduction:
      'Сайт труппы передал корзину партнёрской платформе. Эта версия содержит только надёжную резервную страницу.',
    partnerUnavailableTitle: 'Подключение пока недоступно',
    partnerUnavailableCopy:
      'Эта версия не обращается к внешнему сервису и не создаёт сделку. Можно безопасно вернуться к корзине труппы.',
    returnToBasket: 'Вернуться к корзине труппы',
    selectedCount: 'Выбрано спектаклей: {count}',
    emptyBasket: 'Спектакли не выбраны',
    selectionReady: 'Спектакль и зона мест добавлены в корзину.',
    selectionRequired: 'Чтобы продолжить, выберите хотя бы один спектакль.',
    zonePreview: 'Просмотр: {zone} · {price} LMD. Ещё не добавлено в корзину.',
    zoneInBasket: 'В корзине: {zone} · {price} LMD.',
    seatingPlanSummary: 'Схема сцены и зон',
    seatingPlanAria: 'Сцена и зоны мест для спектакля {title}',
    stageDirection: 'СЦЕНА',
    seatingLevelLabel: 'Уровень {level}',
    seatingPlanNotice:
      'Это схема зон, а не выбор отдельного кресла. На схеме и в списке используются одинаковые значения.',
    selectSeatingZone: 'Выбрать {zone}, базовая цена {price} LMD',
    receiptEyebrow: 'ИМИТАЦИЯ КВИТАНЦИИ',
    receiptTitle: 'Квитанция регистрации мест',
    receiptCopy:
      'Запрос подтверждён. Суммы и места относятся только к этой имитации билетного сервиса.',
    baseTotal: 'Базовая сумма',
    adjustmentNone: 'Нет',
    settledTotal: 'Итоговая условная сумма',
    disclaimer: 'Только игровой материал. Квитанция не создаёт обязательств по обмену.',
    ticketNumber: 'Билет № {number}',
    downloadSvg: 'Скачать SVG',
    printTicket: 'Распечатать билет',
    standardChannel: 'ОБЫЧНЫЙ КАНАЛ',
    priorityChannel: 'ПРИОРИТЕТНЫЙ КАНАЛ',
    standardAttemptTitle: 'Билетная линия перегружена',
    standardAttemptCopy:
      'Система подтверждает каждый спектакль в корзине. После отправки доступность может измениться.',
    premiumAttemptTitle: 'Приоритетный канал повторяет поиск',
    premiumAttemptCopy:
      'Канал обещает улучшить место в очереди и при успехе добавляет сервисную наценку. Результат всё равно не гарантирован.',
    submitRequest: 'Подтвердить и отправить',
    backToBasket: 'Вернуться в корзину',
    networkTitle: 'Сеть перестала отвечать до подтверждения',
    networkCopy:
      'Расчёт не создан, корзина сохранена без изменений. Повторите попытку по тому же маршруту.',
    retryBasket: 'Сохранить корзину и повторить',
    premiumFailureTitle: 'Приоритетный канал не нашёл мест',
    premiumFailureCopy:
      'Места не найдены, но оформлена условная запись об услуге поиска. Корзина и базовые цены не изменились.',
    premiumOfferTitle: 'Общий канал возвращённых мест предлагает новый поиск',
    premiumOfferCopy:
      'Канал изменит порядок запроса и при успехе добавит наценку в 50% от базовой суммы. Место не гарантируется.',
    retentionOfferTitle: 'Последнее предложение перед уходом',
    retentionOfferCopy:
      'Наценка снижена с 50% до 48%. Это единственное предложение удержания в этом раунде, и оно по-прежнему не гарантирует место.',
    standardFailureTitle: 'Высокая нагрузка: запрос не выполнен',
    standardFailureCopy:
      'Сохраните корзину и отправьте запрос снова или попробуйте приоритетный маршрут с доплатой при успехе.',
    retryStandard: 'Повторить обычный маршрут',
    tryPremium: 'Рассмотреть предложение возвращённых мест',
    acceptPremium: 'Принять предложение 150% и искать снова',
    declinePremium: 'Отклонить предложение',
    acceptRetention: 'Принять последнее предложение 148%',
    declineRetention: 'Окончательно отказаться и вернуться',
    retryPremium: 'Повторить приоритетный маршрут',
    returnStandard: 'Отменить наценку и вернуться к обычному маршруту',
    offerBaseTotal: 'Базовая сумма корзины',
    offerAdjustment: 'Условная сервисная наценка',
    offerFinalTotal: 'Текущее условное предложение',
    failureRecordTitle: 'Запись о неудачной услуге',
    allocatedSeats: 'Назначенные места',
    failureServiceFee: 'Условная плата за поиск',
    failureRecordDisclaimer:
      'Реального списания не было. Запись не создаёт квитанцию, памятный билет или обязательство по обмену.',
    startRequired: 'Сначала выберите хотя бы один спектакль.',
    submitted: 'Корзина отправлена. Запущен имитируемый билетный процесс.',
    success: 'Оформление завершено. Памятные билеты готовы.',
    stateUpdated: 'Состояние оформления обновлено.',
    downloadStarted: 'Начато скачивание билета на {title}.',
    newRound: 'Предыдущий раунд завершён. Можно сделать новый выбор.',
    adjustments: {
      'priority-service': 'Наценка приоритетного сервиса',
      'retention-service': 'Наценка последнего предложения',
    },
    artifact: {
      title: 'Памятный билет: {title}',
      description: '{dateTime}, {place}, {zone}, {price} LMD, билет № {number}',
      header: 'БАГРЯНАЯ ТРУППА · ПАМЯТНЫЙ ПРОПУСК',
      dateTime: 'ДАТА И ВРЕМЯ TERRA',
      zone: 'ЗОНА',
      faceValue: 'БАЗОВАЯ НОМИНАЛЬНАЯ ЦЕНА',
      ticketNumber: 'НОМЕР БИЛЕТА',
      alt: 'Памятный билет {title}: {dateTime}, {place}, {zone}, {price} LMD, номер билета и матрица {number}',
    },
  },
  programs: {
    archiveRegister: 'Гастрольный реестр № {index}',
    productionCount: 'Постановок: {count}',
  },
} as const satisfies LocalizedShape<typeof yanMessages>;
