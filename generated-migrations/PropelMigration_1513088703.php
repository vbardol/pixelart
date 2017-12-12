<?php

use Propel\Generator\Manager\MigrationManager;

/**
 * Data object containing the SQL and PHP code to migrate the database
 * up to version 1513088703.
 * Generated on 2017-12-12 14:25:03 by apple
 */
class PropelMigration_1513088703
{
    public $comment = '';

    public function preUp(MigrationManager $manager)
    {
        // add the pre-migration code here
    }

    public function postUp(MigrationManager $manager)
    {
        // add the post-migration code here
    }

    public function preDown(MigrationManager $manager)
    {
        // add the pre-migration code here
    }

    public function postDown(MigrationManager $manager)
    {
        // add the post-migration code here
    }

    /**
     * Get the SQL statements for the Up migration
     *
     * @return array list of the SQL strings to execute for the Up migration
     *               the keys being the datasources
     */
    public function getUpSQL()
    {
        return array (
  'default' => '
# This is a fix for InnoDB in MySQL >= 4.1.x
# It "suspends judgement" for fkey relationships until are tables are set.
SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE `pictures` DROP FOREIGN KEY `pictures_ibfk_1`;

ALTER TABLE `pictures` DROP FOREIGN KEY `pictures_ibfk_2`;

ALTER TABLE `users`

  CHANGE `role` `role` enum(\'admin\',\'membre\') NOT NULL;

# This restores the fkey checks, after having unset them earlier
SET FOREIGN_KEY_CHECKS = 1;
',
);
    }

    /**
     * Get the SQL statements for the Down migration
     *
     * @return array list of the SQL strings to execute for the Down migration
     *               the keys being the datasources
     */
    public function getDownSQL()
    {
        return array (
  'default' => '
# This is a fix for InnoDB in MySQL >= 4.1.x
# It "suspends judgement" for fkey relationships until are tables are set.
SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE `pictures` ADD CONSTRAINT `pictures_ibfk_1`
    FOREIGN KEY (`id_categories`)
    REFERENCES `categories` (`id_categories`);

ALTER TABLE `pictures` ADD CONSTRAINT `pictures_ibfk_2`
    FOREIGN KEY (`id_users`)
    REFERENCES `users` (`id_users`);

ALTER TABLE `users`

  CHANGE `role` `role` VARCHAR(255) NOT NULL;

# This restores the fkey checks, after having unset them earlier
SET FOREIGN_KEY_CHECKS = 1;
',
);
    }

}