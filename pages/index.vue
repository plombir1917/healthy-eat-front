<template>
  <div class="min-h-screen bg-background dark:bg-gray-900">
    <!-- Hero секция -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-600/90 mix-blend-multiply"
        ></div>
        <img
          src="~/assets/images/bg.jpg"
          alt="Фоновое изображение"
          class="w-full h-full object-cover"
        />
      </div>

      <div
        class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="text-white space-y-6">
            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Персональное питание для здоровья вашего ЖКТ
            </h1>
            <p class="text-xl md:text-2xl text-white/90">
              Индивидуальные рекомендации от врачей, учет непереносимости и
              подбор оптимального рациона
            </p>
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <NuxtLink
                to="/register"
                class="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-medium text-center transition-colors"
              >
                Начать бесплатно
              </NuxtLink>
              <NuxtLink
                to="/login"
                class="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium text-center transition-colors"
              >
                Войти
              </NuxtLink>
            </div>
          </div>
          <div class="hidden md:block">
            <img
              src="~/assets/images/logo.svg"
              alt="Здоровое питание"
              class="w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Преимущества -->
    <section class="py-16 md:py-24 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2
            class="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4"
          >
            Почему наше решение?
          </h2>
          <p
            class="text-xl text-secondary dark:text-gray-300 max-w-3xl mx-auto"
          >
            Мы объединили опыт врачей и современные технологии для создания
            персонализированной системы питания
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            class="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6"
            >
              <StethoscopeIcon class="w-7 h-7 text-primary dark:text-white" />
            </div>
            <h3 class="text-xl font-semibold text-primary dark:text-white mb-3">
              Рекомендации от врачей
            </h3>
            <p class="text-secondary dark:text-gray-300">
              Получайте персональные рекомендации от квалифицированных врачей,
              специализирующихся на заболеваниях ЖКТ
            </p>
          </div>

          <div
            class="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6"
            >
              <FilterIcon class="w-7 h-7 text-primary dark:text-white" />
            </div>
            <h3 class="text-xl font-semibold text-primary dark:text-white mb-3">
              Учет непереносимости
            </h3>
            <p class="text-secondary dark:text-gray-300">
              Система учитывает ваши индивидуальные особенности и
              непереносимость определенных продуктов
            </p>
          </div>

          <div
            class="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6"
            >
              <CalculatorIcon class="w-7 h-7 text-primary dark:text-white" />
            </div>
            <h3 class="text-xl font-semibold text-primary dark:text-white mb-3">
              Расчет калорий
            </h3>
            <p class="text-secondary dark:text-gray-300">
              Автоматический расчет оптимального калоража на основе ваших
              параметров и целей
            </p>
          </div>

          <div
            class="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6"
            >
              <UtensilsIcon class="w-7 h-7 text-primary dark:text-white" />
            </div>
            <h3 class="text-xl font-semibold text-primary dark:text-white mb-3">
              Готовые столы питания
            </h3>
            <p class="text-secondary dark:text-gray-300">
              Специально разработанные столы питания для различных заболеваний
              ЖКТ
            </p>
          </div>

          <div
            class="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6"
            >
              <MessageSquareIcon class="w-7 h-7 text-primary dark:text-white" />
            </div>
            <h3 class="text-xl font-semibold text-primary dark:text-white mb-3">
              Общение с врачом
            </h3>
            <p class="text-secondary dark:text-gray-300">
              Возможность задать вопросы врачу и получить подробные комментарии
              к рекомендациям
            </p>
          </div>

          <div
            class="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6"
            >
              <BookOpenIcon class="w-7 h-7 text-primary dark:text-white" />
            </div>
            <h3 class="text-xl font-semibold text-primary dark:text-white mb-3">
              Технологические карты
            </h3>
            <p class="text-secondary dark:text-gray-300">
              Подробные рецепты с указанием КБЖУ и процесса приготовления для
              каждого блюда
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Как это работает -->
    <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2
            class="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4"
          >
            Как это работает
          </h2>
          <p
            class="text-xl text-secondary dark:text-gray-300 max-w-3xl mx-auto"
          >
            Простой процесс получения персональных рекомендаций по питанию
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="relative">
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
              <div
                class="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-6 mx-auto"
              >
                <span class="text-2xl font-bold">1</span>
              </div>
              <h3
                class="text-xl font-semibold text-primary dark:text-white mb-3 text-center"
              >
                Регистрация и профиль
              </h3>
              <p class="text-secondary dark:text-gray-300 text-center">
                Создайте аккаунт и заполните информацию о себе, включая рост,
                вес и особенности здоровья
              </p>
            </div>
            <div
              class="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2"
            >
              <ArrowRightIcon class="w-8 h-8 text-primary dark:text-white" />
            </div>
          </div>

          <div class="relative">
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
              <div
                class="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-6 mx-auto"
              >
                <span class="text-2xl font-bold">2</span>
              </div>
              <h3
                class="text-xl font-semibold text-primary dark:text-white mb-3 text-center"
              >
                Заявка врачу
              </h3>
              <p class="text-secondary dark:text-gray-300 text-center">
                Отправьте заявку на получение рекомендаций от врача, выбрав
                специалиста по вашему заболеванию
              </p>
            </div>
            <div
              class="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2"
            >
              <ArrowRightIcon class="w-8 h-8 text-primary dark:text-white" />
            </div>
          </div>

          <div>
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
              <div
                class="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-6 mx-auto"
              >
                <span class="text-2xl font-bold">3</span>
              </div>
              <h3
                class="text-xl font-semibold text-primary dark:text-white mb-3 text-center"
              >
                Получение рекомендаций
              </h3>
              <p class="text-secondary dark:text-gray-300 text-center">
                Получите персональный план питания с учетом ваших особенностей и
                рекомендациями врача
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Функциональность -->
    <section class="py-16 md:py-24 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2
            class="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4"
          >
            Функциональность системы
          </h2>
          <p
            class="text-xl text-secondary dark:text-gray-300 max-w-3xl mx-auto"
          >
            Все необходимые инструменты для управления вашим питанием
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="order-2 md:order-1">
            <div class="space-y-6">
              <div class="flex items-start">
                <div
                  class="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                >
                  <CheckIcon class="w-5 h-5 text-primary dark:text-white" />
                </div>
                <div>
                  <h3
                    class="text-xl font-semibold text-primary dark:text-white mb-2"
                  >
                    Фильтрация по заболеваниям
                  </h3>
                  <p class="text-secondary dark:text-gray-300">
                    Выбирайте блюда и столы питания, соответствующие вашему
                    диагнозу
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div
                  class="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                >
                  <CheckIcon class="w-5 h-5 text-primary dark:text-white" />
                </div>
                <div>
                  <h3
                    class="text-xl font-semibold text-primary dark:text-white mb-2"
                  >
                    Учет непереносимости
                  </h3>
                  <p class="text-secondary dark:text-gray-300">
                    Система исключает продукты, которые вам противопоказаны
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div
                  class="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                >
                  <CheckIcon class="w-5 h-5 text-primary dark:text-white" />
                </div>
                <div>
                  <h3
                    class="text-xl font-semibold text-primary dark:text-white mb-2"
                  >
                    Расчет калорий
                  </h3>
                  <p class="text-secondary dark:text-gray-300">
                    Автоматический расчет оптимального калоража на основе ваших
                    параметров
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div
                  class="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                >
                  <CheckIcon class="w-5 h-5 text-primary dark:text-white" />
                </div>
                <div>
                  <h3
                    class="text-xl font-semibold text-primary dark:text-white mb-2"
                  >
                    Технологические карты
                  </h3>
                  <p class="text-secondary dark:text-gray-300">
                    Подробные рецепты с указанием ингредиентов, КБЖУ и процесса
                    приготовления
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div
                  class="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                >
                  <CheckIcon class="w-5 h-5 text-primary dark:text-white" />
                </div>
                <div>
                  <h3
                    class="text-xl font-semibold text-primary dark:text-white mb-2"
                  >
                    Общение с врачом
                  </h3>
                  <p class="text-secondary dark:text-gray-300">
                    Возможность задать вопросы и получить комментарии к
                    рекомендациям
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="order-1 md:order-2">
            <img
              src="~/assets/images/logo.png"
              alt="Функциональность приложения"
              class="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Отзывы -->
    <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2
            class="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4"
          >
            Отзывы пользователей
          </h2>
          <p
            class="text-xl text-secondary dark:text-gray-300 max-w-3xl mx-auto"
          >
            Что говорят о нашем сервисе те, кто уже использует его
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
            <div class="flex items-center mb-6">
              <img
                src="https://ui-avatars.com/api/?name=Анна+Петрова&background=3b82f6&color=fff"
                alt="Анна Петрова"
                class="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 class="font-semibold text-primary dark:text-white">
                  Анна Петрова
                </h4>
                <p class="text-sm text-secondary dark:text-gray-300">
                  Пользователь сервиса
                </p>
              </div>
            </div>
            <p class="text-secondary dark:text-gray-300">
              "Благодаря этому сервису я смогла подобрать правильное питание при
              моем заболевании ЖКТ. Рекомендации врача были очень полезны, и я
              почувствовала значительное улучшение."
            </p>
            <div class="flex mt-4">
              <StarIcon class="w-5 h-5 text-yellow-400" />
              <StarIcon class="w-5 h-5 text-yellow-400" />
              <StarIcon class="w-5 h-5 text-yellow-400" />
              <StarIcon class="w-5 h-5 text-yellow-400" />
              <StarIcon class="w-5 h-5 text-yellow-400" />
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
            <div class="flex items-center mb-6">
              <img
                src="https://ui-avatars.com/api/?name=Иван+Сидоров&background=3b82f6&color=fff"
                alt="Иван Сидоров"
                class="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 class="font-semibold text-primary dark:text-white">
                  Иван Сидоров
                </h4>
                <p class="text-sm text-secondary dark:text-gray-300">
                  Пользователь сервиса
                </p>
              </div>
            </div>
            <p class="text-secondary dark:text-gray-300">
              "Очень удобный сервис для подбора питания. Особенно понравилось,
              что система учитывает мои непереносимости и дает подробные рецепты
              с расчетом калорий."
            </p>
            <div class="flex mt-4">
              <StarIcon class="w-5 h-5 text-yellow-400" />
              <StarIcon class="w-5 h-5 text-yellow-400" />
              <StarIcon class="w-5 h-5 text-yellow-400" />
              <StarIcon class="w-5 h-5 text-yellow-400" />
              <StarIcon class="w-5 h-5 text-yellow-400" />
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
            <div class="flex items-center mb-6">
              <img
                src="https://ui-avatars.com/api/?name=Мария+Козлова&background=3b82f6&color=fff"
                alt="Мария Козлова"
                class="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 class="font-semibold text-primary dark:text-white">
                  Мария Козлова
                </h4>
                <p class="text-sm text-secondary dark:text-gray-300">
                  Пользователь сервиса
                </p>
              </div>
            </div>
            <p class="text-secondary dark:text-gray-300">
              "Как врач-гастроэнтеролог, я рекомендую этот сервис своим
              пациентам. Он помогает им следовать правильному питанию и улучшает
              результаты лечения."
            </p>
            <div class="flex mt-4">
              <StarIcon class="w-5 h-5 text-yellow-400" />
              <StarIcon class="w-5 h-5 text-yellow-400" />
              <StarIcon class="w-5 h-5 text-yellow-400" />
              <StarIcon class="w-5 h-5 text-yellow-400" />
              <StarIcon class="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA секция -->
    <section class="py-16 md:py-24 bg-primary dark:bg-blue-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Готовы улучшить свое здоровье?
        </h2>
        <p class="text-xl text-white/90 max-w-3xl mx-auto mb-8">
          Присоединяйтесь к нашему сервису и получите персональные рекомендации
          по питанию от квалифицированных врачей
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/register"
            class="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-medium text-center transition-colors"
          >
            Зарегистрироваться
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-medium text-center transition-colors"
          >
            Войти
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Футер -->
    <footer class="bg-gray-800 dark:bg-gray-900 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center mb-4">
              <img
                src="~/assets/images/logo.png"
                alt="Логотип"
                class="h-8 w-auto mr-2"
              />
              <span class="text-xl font-bold text-white">Zдоровье</span>
            </div>
            <p class="text-gray-400">
              Персональное питание для здоровья вашего ЖКТ
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-white mb-4">Навигация</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink
                  to="/"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Главная</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/login"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Вход</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/register"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Регистрация</NuxtLink
                >
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-white mb-4">Функции</h3>
            <ul class="space-y-2">
              <li class="text-gray-400">Подбор питания</li>
              <li class="text-gray-400">Рекомендации врачей</li>
              <li class="text-gray-400">Расчет калорий</li>
              <li class="text-gray-400">Технологические карты</li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-white mb-4">Контакты</h3>
            <ul class="space-y-2">
              <li class="flex items-center text-gray-400">
                <MailIcon class="w-5 h-5 mr-2" />
                info@zdorovye.ru
              </li>
              <li class="flex items-center text-gray-400">
                <PhoneIcon class="w-5 h-5 mr-2" />
                +7 (999) 123-45-67
              </li>
              <li class="flex items-center text-gray-400">
                <MapPinIcon class="w-5 h-5 mr-2" />
                г. Москва, ул. Примерная, 123
              </li>
            </ul>
          </div>
        </div>

        <div
          class="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400"
        >
          <p>&copy; 2025 Zдоровье. Все права защищены.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import {
  StethoscopeIcon,
  FilterIcon,
  CalculatorIcon,
  UtensilsIcon,
  MessageSquareIcon,
  BookOpenIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
} from 'lucide-vue-next';

definePageMeta({
  layout: 'empty',
});

useHead({
  title: 'Zдоровье - Главная',
  meta: [
    {
      name: 'description',
      content:
        'Персональное питание для здоровья вашего ЖКТ. Получите индивидуальные рекомендации от врачей, учет непереносимости и подбор оптимального рациона.',
    },
    { property: 'og:title', content: 'Zдоровье - Главная' },
    {
      property: 'og:description',
      content:
        'Персональное питание для здоровья вашего ЖКТ. Получите индивидуальные рекомендации от врачей, учет непереносимости и подбор оптимального рациона.',
    },
    { property: 'og:type', content: 'website' },
  ],
});
</script>

<style scoped>
/* Дополнительные стили, если необходимо */
</style>
