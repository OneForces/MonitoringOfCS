# promotions/apps.py
from django.apps import AppConfig

class PromotionsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'promotions'

    def ready(self):
        from promotions.models import Service
        if not Service.objects.exists():
            Service.objects.create(
                name="BOOST и GAMEMENU от 15р",
                description="Круги на вылет. В поиске по порядку после услуги Премиум",
                price_per_unit="15.00",
                service_type="boost",
                duration_days=0
            )
            Service.objects.create(
                name="Цвет 190р / 30 дней",
                description="Приоритет серверов с VIP в случайном порядке после услуги",
                price_per_unit="190.00",
                service_type="color",
                duration_days=30,
                available_colors=["#77ffaa", "#ffff55", "#ff8888", "#bbccff", "#f2aafc"]
            )
