import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type Screen = 'pin' | 'main' | 'balance' | 'transfer' | 'transfer-form' | 'history' | 'withdraw' | 'withdraw-custom' | 'change-pin' | 'change-pin-form' | 'credits' | 'credit-details';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('pin');
  const [pin, setPin] = useState('');
  const [cardNumber] = useState('•••• 1234');
  const [balance, setBalance] = useState(45678.90);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferCard, setTransferCard] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [selectedCredit, setSelectedCredit] = useState<number | null>(null);
  const [historyItems, setHistoryItems] = useState([
    { date: '15.01.2025', desc: 'Покупка в магазине', amount: -1250.50 },
    { date: '14.01.2025', desc: 'Пополнение', amount: 10000 },
    { date: '13.01.2025', desc: 'Снятие наличных', amount: -5000 },
    { date: '12.01.2025', desc: 'Перевод другу', amount: -2000 },
  ]);

  const { toast } = useToast();

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
    setTransferAmount('');
    setTransferCard('');
    setCustomAmount('');
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
    setSelectedCredit(null);
  };

  const handleWithdraw = (amount: number) => {
    if (amount > balance) {
      toast({
        title: "Недостаточно средств",
        description: "На вашей карте недостаточно средств для выполнения операции",
        variant: "destructive",
      });
      return;
    }
    
    setBalance(balance - amount);
    setHistoryItems([
      { date: new Date().toLocaleDateString('ru-RU'), desc: 'Снятие наличных', amount: -amount },
      ...historyItems
    ]);
    
    toast({
      title: "Операция выполнена",
      description: `Снято ${amount.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}. Заберите наличные.`,
    });
    
    setTimeout(() => setCurrentScreen('main'), 2000);
  };

  const handleCustomWithdraw = () => {
    const amount = parseFloat(customAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректную сумму",
        variant: "destructive",
      });
      return;
    }
    if (amount % 100 !== 0) {
      toast({
        title: "Ошибка",
        description: "Сумма должна быть кратна 100 рублям",
        variant: "destructive",
      });
      return;
    }
    handleWithdraw(amount);
    setCustomAmount('');
  };

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректную сумму перевода",
        variant: "destructive",
      });
      return;
    }
    if (!transferCard || transferCard.length < 16) {
      toast({
        title: "Ошибка",
        description: "Введите корректный номер карты получателя",
        variant: "destructive",
      });
      return;
    }
    if (amount > balance) {
      toast({
        title: "Недостаточно средств",
        description: "На вашей карте недостаточно средств",
        variant: "destructive",
      });
      return;
    }

    setBalance(balance - amount);
    setHistoryItems([
      { date: new Date().toLocaleDateString('ru-RU'), desc: `Перевод на •••• ${transferCard.slice(-4)}`, amount: -amount },
      ...historyItems
    ]);

    toast({
      title: "Перевод выполнен",
      description: `Переведено ${amount.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}`,
    });

    setTransferAmount('');
    setTransferCard('');
    setTimeout(() => setCurrentScreen('main'), 2000);
  };

  const handleChangePin = () => {
    if (oldPin.length !== 4) {
      toast({
        title: "Ошибка",
        description: "Введите текущий ПИН-код",
        variant: "destructive",
      });
      return;
    }
    if (newPin.length !== 4 || confirmPin.length !== 4) {
      toast({
        title: "Ошибка",
        description: "ПИН-код должен содержать 4 цифры",
        variant: "destructive",
      });
      return;
    }
    if (newPin !== confirmPin) {
      toast({
        title: "Ошибка",
        description: "ПИН-коды не совпадают",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "ПИН-код изменён",
      description: "Новый ПИН-код успешно установлен",
    });

    setOldPin('');
    setNewPin('');
    setConfirmPin('');
    setTimeout(() => setCurrentScreen('main'), 2000);
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
      <Button 
        onClick={() => setCurrentScreen('transfer-form')} 
        className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-lg"
      >
        Начать перевод
      </Button>
      <Button onClick={() => setCurrentScreen('main')} className="bg-gray-300 hover:bg-gray-400 text-foreground px-12 py-6 text-lg">
        Вернуться в меню
      </Button>
    </div>
  );

  const renderTransferForm = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
      <Icon name="ArrowRightLeft" size={48} className="text-primary" />
      <div className="text-2xl font-medium text-foreground">Перевод средств</div>
      
      <div className="w-full max-w-md space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Номер карты получателя</label>
          <Input
            type="text"
            placeholder="0000 0000 0000 0000"
            value={transferCard}
            onChange={(e) => setTransferCard(e.target.value.replace(/\D/g, '').slice(0, 16))}
            maxLength={16}
            className="text-lg"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Сумма перевода</label>
          <Input
            type="number"
            placeholder="0.00"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            className="text-lg"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleTransfer} className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-lg">
          Перевести
        </Button>
        <Button onClick={() => setCurrentScreen('transfer')} className="bg-gray-300 hover:bg-gray-400 text-foreground px-12 py-6 text-lg">
          Отмена
        </Button>
      </div>
    </div>
  );

  const renderHistoryScreen = () => (
    <div className="flex flex-col h-full">
      <div className="bg-primary text-white p-6 text-center">
        <div className="text-xl font-semibold">История операций</div>
      </div>
      <div className="flex-1 p-6 space-y-4 overflow-auto">
        {historyItems.map((item, idx) => (
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
        {[1000, 2000, 3000, 5000, 10000].map((amount) => (
          <Button
            key={amount}
            onClick={() => handleWithdraw(amount)}
            className="h-20 text-xl font-semibold bg-white text-foreground hover:bg-primary hover:text-white border-2 border-gray-300"
          >
            {amount} ₽
          </Button>
        ))}
        <Button
          onClick={() => setCurrentScreen('withdraw-custom')}
          className="h-20 text-xl font-semibold bg-white text-foreground hover:bg-primary hover:text-white border-2 border-gray-300"
        >
          Другая сумма
        </Button>
      </div>
      <Button onClick={() => setCurrentScreen('main')} className="bg-gray-300 hover:bg-gray-400 text-foreground px-12 py-6 text-lg mt-4">
        Отмена
      </Button>
    </div>
  );

  const renderWithdrawCustom = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
      <Icon name="Banknote" size={48} className="text-primary" />
      <div className="text-2xl font-medium text-foreground">Введите сумму</div>
      
      <div className="w-full max-w-sm">
        <Input
          type="number"
          placeholder="Сумма (кратная 100₽)"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          className="text-2xl text-center h-16"
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={handleCustomWithdraw} className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-lg">
          Снять
        </Button>
        <Button onClick={() => setCurrentScreen('withdraw')} className="bg-gray-300 hover:bg-gray-400 text-foreground px-12 py-6 text-lg">
          Отмена
        </Button>
      </div>
    </div>
  );

  const renderChangePinScreen = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
      <Icon name="KeyRound" size={64} className="text-primary" />
      <div className="text-2xl font-medium text-foreground">Смена ПИН-кода</div>
      <Button 
        onClick={() => setCurrentScreen('change-pin-form')} 
        className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-lg"
      >
        Изменить ПИН-код
      </Button>
      <Button onClick={() => setCurrentScreen('main')} className="bg-gray-300 hover:bg-gray-400 text-foreground px-12 py-6 text-lg">
        Вернуться в меню
      </Button>
    </div>
  );

  const renderChangePinForm = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
      <Icon name="KeyRound" size={48} className="text-primary" />
      <div className="text-2xl font-medium text-foreground">Смена ПИН-кода</div>
      
      <div className="w-full max-w-md space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Текущий ПИН-код</label>
          <Input
            type="password"
            placeholder="••••"
            value={oldPin}
            onChange={(e) => setOldPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            className="text-lg text-center"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Новый ПИН-код</label>
          <Input
            type="password"
            placeholder="••••"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            className="text-lg text-center"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Подтвердите ПИН-код</label>
          <Input
            type="password"
            placeholder="••••"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            className="text-lg text-center"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleChangePin} className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-lg">
          Изменить
        </Button>
        <Button onClick={() => setCurrentScreen('change-pin')} className="bg-gray-300 hover:bg-gray-400 text-foreground px-12 py-6 text-lg">
          Отмена
        </Button>
      </div>
    </div>
  );

  const credits = [
    { name: 'Потребительский кредит', rate: '9.9%', max: 'до 3 млн ₽', description: 'Универсальный кредит на любые цели с минимальной ставкой' },
    { name: 'Рефинансирование', rate: '8.9%', max: 'до 5 млн ₽', description: 'Объедините все кредиты в один с выгодной ставкой' },
    { name: 'Кредитная карта', rate: '23.9%', max: 'до 600 тыс ₽', description: 'Беспроцентный период до 120 дней' },
  ];

  const renderCreditsScreen = () => (
    <div className="flex flex-col h-full">
      <div className="bg-primary text-white p-6 text-center">
        <div className="text-xl font-semibold">Кредитные продукты</div>
      </div>
      <div className="flex-1 p-6 space-y-4 overflow-auto">
        {credits.map((credit, idx) => (
          <Card 
            key={idx} 
            onClick={() => {
              setSelectedCredit(idx);
              setCurrentScreen('credit-details');
            }}
            className="p-6 bg-white border-2 border-gray-200 hover:border-primary transition-all cursor-pointer"
          >
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

  const renderCreditDetails = () => {
    if (selectedCredit === null) return null;
    const credit = credits[selectedCredit];
    
    return (
      <div className="flex flex-col h-full">
        <div className="bg-primary text-white p-6 text-center">
          <div className="text-xl font-semibold">{credit.name}</div>
        </div>
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Icon name="CreditCard" size={64} className="text-primary mx-auto" />
              <div className="text-3xl font-bold text-primary">{credit.rate}</div>
              <div className="text-muted-foreground">годовая ставка</div>
            </div>

            <Card className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Максимальная сумма:</span>
                <span className="font-semibold">{credit.max}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Срок кредита:</span>
                <span className="font-semibold">до 7 лет</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Решение:</span>
                <span className="font-semibold">за 2 минуты</span>
              </div>
            </Card>

            <div className="text-muted-foreground text-center">
              {credit.description}
            </div>

            <Button 
              onClick={() => {
                toast({
                  title: "Заявка принята",
                  description: "Менеджер свяжется с вами в ближайшее время",
                });
                setTimeout(() => setCurrentScreen('main'), 2000);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
            >
              Оформить заявку
            </Button>
          </div>
        </div>
        <div className="p-6">
          <Button onClick={() => setCurrentScreen('credits')} className="w-full bg-gray-300 hover:bg-gray-400 text-foreground py-6 text-lg">
            Назад к списку
          </Button>
        </div>
      </div>
    );
  };

  const screens = {
    pin: renderPinScreen,
    main: renderMainMenu,
    balance: renderBalanceScreen,
    transfer: renderTransferScreen,
    'transfer-form': renderTransferForm,
    history: renderHistoryScreen,
    withdraw: renderWithdrawScreen,
    'withdraw-custom': renderWithdrawCustom,
    'change-pin': renderChangePinScreen,
    'change-pin-form': renderChangePinForm,
    credits: renderCreditsScreen,
    'credit-details': renderCreditDetails,
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
                  <div 
                    onClick={() => setCurrentScreen('main')}
                    className="w-24 h-12 bg-gray-700 rounded flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:bg-gray-600 transition-all"
                  >
                    Меню
                  </div>
                  <div 
                    onClick={() => setCurrentScreen('balance')}
                    className="w-24 h-12 bg-gray-700 rounded flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:bg-gray-600 transition-all"
                  >
                    Баланс
                  </div>
                  <div 
                    onClick={() => setCurrentScreen('history')}
                    className="w-24 h-12 bg-gray-700 rounded flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:bg-gray-600 transition-all"
                  >
                    История
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
