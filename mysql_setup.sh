#!/bin/bash

mysqld_safe \
--max_allowed_packet=1G \
--net_buffer_length=1000000 \
--net_read_timeout=3600 \
--net_write_timeout=3600 \
--connect_timeout=3600 \
--wait_timeout=28800 \
--interactive_timeout=28800 \
--max_connections=1000 \
&

sleep 5

mysql -u root -e "
CREATE USER IF NOT EXISTS 'root'@'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY 'root' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SET GLOBAL max_allowed_packet=1024*1024*1024;
SET GLOBAL net_buffer_length=1000000;
SET GLOBAL net_read_timeout=3600;
SET GLOBAL net_write_timeout=3600;
SET GLOBAL connect_timeout=3600;
SET GLOBAL wait_timeout=28800;
SET GLOBAL interactive_timeout=28800;" 