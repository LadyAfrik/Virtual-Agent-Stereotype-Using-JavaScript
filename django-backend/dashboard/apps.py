from django.apps import AppConfig  # Importing the 'AppConfig' class from Django, which is used to configure and manage application-specific settings in a Django project.

# DashboardConfig class is used to configure the 'dashboard' app in Django.

class DashboardConfig(AppConfig):
    # 'default_auto_field' sets the default field type for auto-generated primary keys.
    # In this case, we're using 'BigAutoField', which is a 64-bit integer,
    # capable of handling larger volumes of data compared to the default 32-bit 'AutoField'.
    default_auto_field = 'django.db.models.BigAutoField'

    # The 'name' attribute specifies the full Python path to the application.
    # Here, 'dashboard' is the name of the app, and it will be used by Django
    # to identify and manage the app within the project.
    name = 'dashboard'
