<?php
# -- BEGIN LICENSE BLOCK ----------------------------------
# This file is part of commentsWikibar, a plugin for Dotclear 2.
#
# Copyright (c) Pep, Franck Paul and contributors
# carnet.franck.paul@gmail.com
#
# Licensed under the GPL version 2.0 license.
# A copy of this license is available in LICENSE file or at
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
# -- END LICENSE BLOCK ------------------------------------

if (!defined('DC_RC_PATH')) { return; }

$this->registerModule(
	/* Name */		"Comments Wikibar",
	/* Description*/	"Adds a formatting toolbar when public comments use the wiki syntax",
	/* Author */		"Pep and contributors",
	/* Version */		'1.7',
	/* Permissions */	'contentadmin'
);
?>