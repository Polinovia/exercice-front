<?php
require 'config.php';

function myPrint_r($value)
{
  if (DEBUG) {
    echo ('<pre>');
      print_r($value);
    echo ('</pre>');
  }
};
