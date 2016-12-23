var sprintStatsPopupOpen = false;
var enableSwitch = true;

function createSprintStatsButton() {
    if ($('.sprint-stats').length > 0) {
        return;
    }

    var $bodyHeader = $('.board-header');

    if ($bodyHeader.length === 0) {
        setTimeout(createSprintStatsButton, 1000);
        return;
    }

    $bodyHeader.append('<a href="#" class="board-header-btn board-header-btn-without-icon sprint-stats" id="sg-sprint-stats"><span class="board-header-btn-text">Show Sprint Stats</span></a>');

    setInterval(function() {
        if ($('#sg-sprint-stats').length > 0) {
            return;
        }

        var $bodyHeader = $('.board-header');

        if ($bodyHeader.length === 0) {
            return;
        }


        $bodyHeader.append('<a href="#" class="board-header-btn board-header-btn-without-icon sprint-stats" id="sg-sprint-stats"><span class="board-header-btn-text">Show Sprint Stats</span></a>');
    }, 2000);

    var $body = $('body');

    $(document).on('click', function () {
        if (!sprintStatsPopupOpen) {
            return;
        }

        $('.full-sprint-popup').remove();
        sprintStatsPopupOpen = false;
    });

    $body.on('click', '.full-sprint-popup', function (e) {
        e.stopPropagation();
    });

    $body.on('click', '.sprint-stats', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (!enableSwitch) {
            return;
        }

        enableSwitch = false;
        setTimeout(function () {
            enableSwitch = true;
        }, 500);

        if (sprintStatsPopupOpen) {
            $('.full-sprint-popup').remove();
            sprintStatsPopupOpen = false;
            return;
        }

        sprintStatsPopupOpen = true;

        var statHtml = '<div class="main-sprint-stat-content">';
        statHtml += getColumnHtml();
        statHtml += '</div>';

        $('body').append('<div class="pop-over is-shown full-sprint-popup" style="left: 385px; top: 84px;"><div class="pop-over-header js-pop-over-header"><span class="pop-over-header-title">Sprint Points</span><a href="#" class="pop-over-header-close-btn icon-sm icon-close"></a></div><div class="pop-over-content">' + statHtml + '</div></div>');
    });

    $body.on('click', '.sprint-per-user-stats', function (e) {
        e.preventDefault();
        $('.main-sprint-stat-content').html(getUserHtml());
    });

    $body.on('click', '.sprint-per-column-stats', function (e) {
        e.preventDefault();
        $('.main-sprint-stat-content').html(getColumnHtml());
    });

    $body.on('click', '.full-sprint-popup .icon-close', function (e) {
        if (!sprintStatsPopupOpen) {
            return;
        }

        $('.full-sprint-popup').remove();
        sprintStatsPopupOpen = false;
    });
}

function getUserHtml() {
    var stats = calcStats();
    var statHtml = '';

    statHtml += '<p>';

    var userList = [];

    $.each(stats.toDoPerUser, function (index) {
        userList.push(index);
    });

    userList.sort();

    for (var i = 0; i < userList.length; ++i) {
        var index = userList[i];
        var name = index.substr(0, index.lastIndexOf(' '));
        statHtml += '<strong>' + name + '</strong> <span style="float: right">' + stats.donePerUser[index] + ' SP / ' + stats.toDoPerUser[index] + ' SP</span><br/>';
    }

    statHtml += '</p>';

    statHtml += '<hr/>';

    statHtml += '<p>';

    if (stats.totalActive !== stats.totalAActive) {
        statHtml += '<strong>Total active</strong> <span style="float: right"><span style="text-decoration: line-through;">' + stats.totalActive + '</span> -> ' + stats.totalAActive + ' SP (' + stats.totalACards + ' cards)</span><br/>';
    } else {
        statHtml += '<strong>Total active</strong> <span style="float: right">' + stats.totalActive + ' SP (' + stats.totalACards + ' cards)</span><br/>';
    }

    if (stats.totalDone !== stats.totalADone) {
        statHtml += '<strong>Total done</strong> <span style="float: right"><span style="text-decoration: line-through;">' + stats.totalDone + '</span> -> ' + stats.totalADone + ' SP (' + stats.totalDCards + ' cards)</span><br/>';
    } else {
        statHtml += '<strong>Total done</strong> <span style="float: right">' + stats.totalDone + ' SP (' + stats.totalDCards + ' cards)</span><br/>';
    }

    if (stats.totalActive !== stats.totalAActive || stats.totalDone !== stats.totalADone) {
        statHtml += '<strong>Total</strong> <span style="float: right"><span style="text-decoration: line-through;">' + (stats.totalDone + stats.totalActive) + '</span> -> ' + (stats.totalADone + stats.totalAActive) + ' SP (' + (stats.totalACards + stats.totalDCards) + ' cards)</span><br/>';
    } else {
        statHtml += '<strong>Total</strong> <span style="float: right">' + (stats.totalDone + stats.totalActive) + ' SP (' + (stats.totalACards + stats.totalDCards) + ' cards)</span><br/>';
    }

    statHtml += '</p>';

    statHtml += '<hr/>';

    statHtml += '<a href="#" class="sprint-per-column-stats">Per Column Stats</a>';

    return statHtml;
}

function getColumnHtml() {
    var stats = calcStats();
    var statHtml = '';

    statHtml += '<p>';

    $.each(stats.columnResults, function (index, value) {
        if (value.points !== value.actual) {
            statHtml += '<strong>' + index + '</strong> <span style="float: right"><span style="text-decoration: line-through;">' + value.points + '</span> -> ' + value.actual + ' SP (' + value.cards + ' cards)</span><br/>';
        } else {
            statHtml += '<strong>' + index + '</strong> <span style="float: right">' + value.points + ' SP (' + value.cards + ' cards)</span><br/>';
        }
    });

    statHtml += '</p>';

    statHtml += '<hr/>';

    statHtml += '<p>';

    if (stats.totalActive !== stats.totalAActive) {
        statHtml += '<strong>Total active</strong> <span style="float: right"><span style="text-decoration: line-through;">' + stats.totalActive + '</span> -> ' + stats.totalAActive + ' SP (' + stats.totalACards + ' cards)</span><br/>';
    } else {
        statHtml += '<strong>Total active</strong> <span style="float: right">' + stats.totalActive + ' SP (' + stats.totalACards + ' cards)</span><br/>';
    }

    if (stats.totalDone !== stats.totalADone) {
        statHtml += '<strong>Total done</strong> <span style="float: right"><span style="text-decoration: line-through;">' + stats.totalDone + '</span> -> ' + stats.totalADone + ' SP (' + stats.totalDCards + ' cards)</span><br/>';
    } else {
        statHtml += '<strong>Total done</strong> <span style="float: right">' + stats.totalDone + ' SP (' + stats.totalDCards + ' cards)</span><br/>';
    }

    if (stats.totalActive !== stats.totalAActive || stats.totalDone !== stats.totalADone) {
        statHtml += '<strong>Total</strong> <span style="float: right"><span style="text-decoration: line-through;">' + (stats.totalDone + stats.totalActive) + '</span> -> ' + (stats.totalADone + stats.totalAActive) + ' SP (' + (stats.totalACards + stats.totalDCards) + ' cards)</span><br/>';
    } else {
        statHtml += '<strong>Total</strong> <span style="float: right">' + (stats.totalDone + stats.totalActive) + ' SP (' + (stats.totalACards + stats.totalDCards) + ' cards)</span><br/>';
    }

    statHtml += '</p>';

    statHtml += '<hr/>';

    statHtml += '<a href="#" class="sprint-per-user-stats">Per User Stats</a>';

    return statHtml;
}

function getColumnType(fullName)
{
    var whitelistedColumns = [
        /Sprint #\d+ Backlog/ig,
        /Doing( \d+)*/ig,
        /Code Review( \d+)*/ig,
        /QA( \d+)*/ig,
        /(Finished( \d+)*)|(Done( \d+)*)/ig,
        /Deployed( \d+)*/ig
    ];
    var typeNames = [
        'Sprint Backlog',
        'Doing',
        'Code Review',
        'QA',
        'Done',
        'Deployed'
    ];

    for (var i = 0; i < whitelistedColumns.length; ++i) {
        if (!fullName.match(whitelistedColumns[i])) {
            continue;
        }

        return typeNames[i];
    }

    return null;
}

function calcStats() {
    var results = {};
    var totalActive = 0;
    var totalAActive = 0;
    var totalACards = 0;
    var totalDone = 0;
    var totalADone = 0;
    var totalDCards = 0;
    var donePerUser = {};
    var toDoPerUser = {};
    var doneAPerUser = {};
    var toDoAPerUser = {};
    var blacklist = [
        'Milica Spasojevic (milica_spasojevic)',
        'Milos (mmihaljevic)',
        'Nemanja Aleksic (calileu)',
        'Nenad Conic (nenadconic1)',
        'Nenad Tocilovac (nenadtocilovac)',
        'Rados Milacic (radosmilacic)',
        'Vladeta Putnikovic (vputnikovic)',
        'Predrag Rogic (prezha)',
        'Nevena Tomovic (nevenatomovic)',
        'Nikola Mitrovic (mitrovicnikola)',
        'Robert Jakupak (robertjakupak)',
        'Milos Milosevic (milosevic_milos)',
        'Maja Dimitrovska (majadimitrovska)',
        'Petar Atanasovski (petaratanasovski)',
        'Vladimir Ranđelović (vladimirrandelovic)',
        'mwpsupport (mwpsupport)'
    ];

    $('.js-list.list-wrapper').each(function () {
        var name = $(this).find('.list-header-name-assist.js-list-name-assist').text();
        name = getColumnType(name);

        if (name === null) {
            return;
        }

        var value = 0;
        var actualValue = 0;
        var count = 0;
        $(this).find('.badge-text').each(function () {
            var text = $(this).text();
            var spRegExp = /SP:?\s*(\d+(\.\d+)?)/ig;
            var spResult = spRegExp.exec(text);
            if (!spResult) {
                return;
            }
            var cardValue = parseFloat(spResult[1]);
            var actualCardValue = cardValue;

            $(this).parents().eq(2).find('.badge-text').each(function () {
                var text = $(this).text();
                var apRegExp = /AP:?\s*(\d+(\.\d+)?)/ig;
                var apResult = apRegExp.exec(text);
                if (!apResult) {
                    return;
                }

                actualCardValue = parseFloat(apResult[1]);
            });

            var process = function () {
                var user = $(this).attr('title');

                if (blacklist.indexOf(user) !== -1) {
                    return;
                }

                if (!toDoPerUser[user]) {
                    toDoPerUser[user] = 0;
                    donePerUser[user] = 0;
                    toDoAPerUser[user] = 0;
                    doneAPerUser[user] = 0;
                }

                toDoPerUser[user] += cardValue;
                toDoAPerUser[user] += actualCardValue;

                if (name === 'Done' || name === 'Deployed') {
                    donePerUser[user] += cardValue;
                    doneAPerUser[user] += actualCardValue;
                }
            };

            $(this).parents().eq(4).find('.member-avatar').each(process);
            $(this).parents().eq(4).find('.member-initials').each(process);

            value += cardValue;
            actualValue += actualCardValue;
            ++count;
        });

        if (results[name]) {
            results[name].points += value;
            results[name].actual += actualValue;
            results[name].cards += count;
        } else {
            results[name] = {
                points: value,
                actual: actualValue,
                cards: count
            };
        }

        if (name !== 'Done' && name !== 'Deployed') {
            totalActive += value;
            totalAActive += actualValue;
            totalACards += count;
        } else {
            totalDone += value;
            totalADone += actualValue;
            totalDCards += count;
        }
    });

    return {
        columnResults: results,
        totalActive: totalActive,
        totalAActive: totalAActive,
        totalDone: totalDone,
        totalADone: totalADone,
        totalACards: totalACards,
        totalDCards: totalDCards,
        toDoPerUser: toDoPerUser,
        toDoAPerUser: toDoAPerUser,
        donePerUser: donePerUser,
        doneAPerUser: doneAPerUser
    };
}

createSprintStatsButton();
