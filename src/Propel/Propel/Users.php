<?php
namespace Propel\Propel;
use ArrayAccess;
use Propel\Propel\Base\Users as BaseUsers;
use Symfony\Component\Security\Core\User\UserInterface;
use Propel\Propel\Map\UsersTableMap;
/**
 * Skeleton subclass for representing a row from the 'users' table.
 *
 *
 *
 * You should add additional methods to this class to meet the
 * application requirements.  This class will only be generated as
 * long as it does not already exist in the output directory.
 *
 */
class Users extends BaseUsers implements UserInterface, ArrayAccess
{
    public function eraseCredentials() {
        
    }
    public function getRoles() {
        return explode('|', $this->getRole());
    }
    public function setRole($role){
        $this->role = $role;
        $this->modifiedColumns[UsersTableMap::COL_ROLE] = true;
    }

    public function offsetExists($offset){
        return null;
    }

    public function offsetGet($offset) {
        
    }

    public function offsetSet($offset, $value): void {
        
    }

    public function offsetUnset($offset): void {
        
    }

}
