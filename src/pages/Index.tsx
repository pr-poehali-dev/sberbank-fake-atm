import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type Screen = 'pin' | 'main' | 'balance' | 'transfer' | 'history' | 'withdraw' | 'change-pin' | 'credits';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('pin');
  const [pin, setPin] = useState('');
  const [cardNumber] = useState('•••• 1234');
  const [balance] = useState(45678.90);

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
      if (pin.length === 3) {
        setTimeout(() => {
          setCurrentScreen('main');
          setPin('');
        }, 300);
      }
    }
  };

  const clearPin = () => setPin('');

  const deleteLastDigit = () => setPin(pin.slice(0, -1));

  const exitATM = () => {
    setCurrentScreen('pin');
    setPin('');
  };

  const renderPinScreen = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <div className="text-center space-y-4">
        <div className="text-2xl font-medium text-foreground">Введите ПИН-код</div>
        <div className="flex gap-3 justify-center">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border-2 border-primary transition-all"
              style={{
                backgroundColor: i < pin.length ? '#21A038' : 'transparent',
              }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 w-80">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <Button
            key={digit}
            onClick={() => handlePinInput(digit.toString())}
            className="h-16 text-2xl font-semibold bg-white text-foreground hover:bg-primary hover:text-white border-2 border-gray-300 transition-all"
          >
            {digit}
          </Button>
        ))}
        <Button
          onClick={clearPin}
          className="h-16 text-lg bg-red-500 text-white hover:bg-red-600"
        >
          Сброс
        </Button>
        <Button
          onClick={() => handlePinInput('0')}
          className="h-16 text-2xl font-semibold bg-white text-foreground hover:bg-primary hover:text-white border-2 border-gray-300"
        >
          0
        </Button>
        <Button
          onClick={deleteLastDigit}
          className="h-16 text-lg bg-gray-300 text-foreground hover:bg-gray-400"
        >
          <Icon name="Delete" size={24} />
        </Button>
      </div>
    </div>
  );

  const menuItems = [
    { id: 'balance', label: 'Запрос баланса', icon: 'Wallet', screen: 'balance' as Screen },
    { id: 'transfer', label: 'Перевод средств', icon: 'ArrowRightLeft', screen: 'transfer' as Screen },
    { id: 'withdraw', label: 'Снятие наличных', icon: 'Banknote', screen: 'withdraw' as Screen },
    { id: 'history', label: 'История операций', icon: 'Receipt', screen: 'history' as Screen },
    { id: 'change-pin', label: 'Смена ПИН-кода', icon: 'KeyRound', screen: 'change-pin' as Screen },
    { id: 'credits', label: 'Кредитные продукты', icon: 'CreditCard', screen: 'credits' as Screen },
  ];

  const renderMainMenu = () => (
    <div className="flex flex-col h-full">
      <div className="bg-primary text-white p-6 text-center">
        <div className="text-xl font-semibold">Главное меню</div>
        <div className="text-sm mt-2 opacity-90">Карта {cardNumber}</div>
      </div>
      
      <div className="flex-1 p-6">
        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              onClick={() => setCurrentScreen(item.screen)}
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105 bg-white border-2 border-gray-200 hover:border-primary"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Icon name={item.icon} size={32} className="text-primary" />
                </div>
                <div className="font-semibold text-foreground">{item.label}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBalanceScreen = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <div className="text-center space-y-4">
        <Icon name="Wallet" size={64} className="text-primary mx-auto" />
        <div className="text-2xl font-medium text-foreground">Баланс по карте</div>
        <div className="text-sm text-muted-foreground">Карта {cardNumber}</div>
        <div className="text-5xl font-bold text-primary">{balance.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</div>
      </div>
      <Button onClick={() => setCurrentScreen('main')} className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-lg">
        Вернуться в меню
      </Button>
    </div>
  );

  const renderTransferScreen = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
      <Icon name="ArrowRightLeft" size={64} className="text-primary" />
      <div className="text-2xl font-medium text-foreground">Перевод средств</div>
      <div className="text-muted-foreground text-center max-w-md">
        Функция перевода средств позволит отправлять деньги на другие счета и карты
      </div>
      <Button onClick={() => setCurrentScreen('main')} className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-lg">
        Вернуться в меню
      </Button>
    </div>
  );

  const renderHistoryScreen = () => (
    <div className="flex flex-col h-full">
      <div className="bg-primary text-white p-6 text-center">
        <div className="text-xl font-semibold">История операций</div>
      </div>
      <div className="flex-1 p-6 space-y-4 overflow-auto">
        {[
          { date: '15.01.2025', desc: 'Покупка в магазине', amount: -1250.50 },
          { date: '14.01.2025', desc: 'Пополнение', amount: 10000 },
          { date: '13.01.2025', desc: 'Снятие наличных', amount: -5000 },
          { date: '12.01.2025', desc: 'Перевод другу', amount: -2000 },
        ].map((item, idx) => (
          <Card key={idx} className="p-4 bg-white border-2 border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-foreground">{item.desc}</div>
                <div className="text-sm text-muted-foreground">{item.date}</div>
              </div>
              <div className={`text-xl font-bold ${item.amount > 0 ? 'text-primary' : 'text-red-500'}`}>
                {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="p-6">
        <Button onClick={() => setCurrentScreen('main')} className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg">
          Вернуться в меню
        </Button>
      </div>
    </div>
  );

  const renderWithdrawScreen = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <Icon name="Banknote" size={64} className="text-primary" />
      <div className="text-2xl font-medium text-foreground">Снятие наличных</div>
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        {[1000, 2000, 3000, 5000, 10000, 'Другая сумма'].map((amount) => (
          <Button
            key={amount}
            className="h-20 text-xl font-semibold bg-white text-foreground hover:bg-primary hover:text-white border-2 border-gray-300"
          >
            {typeof amount === 'number' ? `${amount} ₽` : amount}
          </Button>
        ))}
      </div>
      <Button onClick={() => setCurrentScreen('main')} className="bg-gray-300 hover:bg-gray-400 text-foreground px-12 py-6 text-lg mt-4">
        Отмена
      </Button>
    </div>
  );

  const renderChangePinScreen = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
      <Icon name="KeyRound" size={64} className="text-primary" />
      <div className="text-2xl font-medium text-foreground">Смена ПИН-кода</div>
      <div className="text-muted-foreground text-center max-w-md">
        Функция смены ПИН-кода позволит установить новый секретный код для вашей карты
      </div>
      <Button onClick={() => setCurrentScreen('main')} className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-lg">
        Вернуться в меню
      </Button>
    </div>
  );

  const renderCreditsScreen = () => (
    <div className="flex flex-col h-full">
      <div className="bg-primary text-white p-6 text-center">
        <div className="text-xl font-semibold">Кредитные продукты</div>
      </div>
      <div className="flex-1 p-6 space-y-4 overflow-auto">
        {[
          { name: 'Потребительский кредит', rate: '9.9%', max: 'до 3 млн ₽' },
          { name: 'Рефинансирование', rate: '8.9%', max: 'до 5 млн ₽' },
          { name: 'Кредитная карта', rate: '23.9%', max: 'до 600 тыс ₽' },
        ].map((credit, idx) => (
          <Card key={idx} className="p-6 bg-white border-2 border-gray-200 hover:border-primary transition-all">
            <div className="space-y-2">
              <div className="text-xl font-semibold text-foreground">{credit.name}</div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ставка от:</span>
                <span className="font-semibold text-primary">{credit.rate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Сумма:</span>
                <span className="font-semibold text-foreground">{credit.max}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="p-6">
        <Button onClick={() => setCurrentScreen('main')} className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg">
          Вернуться в меню
        </Button>
      </div>
    </div>
  );

  const screens = {
    pin: renderPinScreen,
    main: renderMainMenu,
    balance: renderBalanceScreen,
    transfer: renderTransferScreen,
    history: renderHistoryScreen,
    withdraw: renderWithdrawScreen,
    'change-pin': renderChangePinScreen,
    credits: renderCreditsScreen,
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-8">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">СБ</span>
            </div>
            <div className="text-white font-semibold text-lg">Сбербанк</div>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <div className="text-white text-sm">
              {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: '600px' }}>
            {screens[currentScreen]()}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="flex gap-4">
              {currentScreen !== 'pin' && (
                <>
                  <div className="w-24 h-12 bg-gray-700 rounded flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:bg-gray-600 transition-all">
                    F1
                  </div>
                  <div className="w-24 h-12 bg-gray-700 rounded flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:bg-gray-600 transition-all">
                    F2
                  </div>
                  <div className="w-24 h-12 bg-gray-700 rounded flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:bg-gray-600 transition-all">
                    F3
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-4">
              {currentScreen !== 'pin' && (
                <Button
                  onClick={exitATM}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold rounded-lg"
                >
                  Завершить обслуживание
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
