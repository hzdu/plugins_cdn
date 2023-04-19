## Installation

To install the plugin:

1. Open wp-admin and navigate to `Plugins > Add New > Upload`.
2. Click Choose File, and choose the file `iconic-woo-custom-fields-for-variations.zip` that you downloaded earlier. This is *inside* the zip you downloaded from CodeCanyon.
3. Once uploaded, click activate plugin.
4. The plugin is now installed and activated.

## Configuration

There is no configuration or settings page for this plugin.

## Add a Group of Custom Fields

Custom fields can be added to the variaition edit tab in groups, with a title. This is primarily for the admin experience, on the frontend the field group will have no relevance.

Let's get started:

1. Navigate to `Products > Variation Field Groups`.
2. Click `Add New`.
3. Give your field group a title. This will be used to define the group section in the variaition edit tab.
4. Under `Fields` click `Add Field`.
5. Here you have a number of options:  
   * **Add Field**  
     * **Field Label**  
       This is the label an admin user will see for the field.
     * **Field Type**  
       Select the type of field you'd like to use. These are: text, textarea, select, checkboxes, radio. The type of field you choose may enable additional fields.
     * **Field Description**  
       Enter a description of the field, for admin eyes only.
     * **Field Options**  
       Conditional: If you choose the field type as select, checkboxes, or radio button, this field will appear. Enter the otpions for your field, 1 option per line.
   * **Product Page Display Options**
     * **Show Label?**  
       Show the label on the frontend?
     * **Label Position**  
       If yes, should it be above or to the elft of the field value(s).
     * **Display as**  
       Conditional: If you chose checkboxes as your field type, this field will appear. Display your field values on the frontend as a list (ul HTML markup), or a comma separate list.
6. Once you have configured your field, click `Add Field`.
7. You can now add another field in the same way, or edit the field you just added by hovering the field item and clicking `Edit`. You can also remove the field by hovering the item and clicking `Bin`.
8. Once you have added all the fields you require, click `Publish`.

## Using the Custom Fields

Now that you have added your custom fields, you'll want to start filling in the data for your variations!

1. Naviagte to `Products`.
2. Choose any of your variable products.
3. Go to the `Variations` tab.
4. Click on a single variaition.
5. Under the `Variation Description` field, you will see your new fields. Simply fill them in as required and click `Save Changes` or `Update`.

## Viewing the Custom Fields as a Customer

Once you've entered your new variaition data, you can view it on the frontend.

1. Navigate to your variable product on the frontend of your website.
2. Choose the otpions to view your final variation.
3. The contents of your custom fields will be inserted below the variaition description. This content will update accordingly as you change between variaitions.