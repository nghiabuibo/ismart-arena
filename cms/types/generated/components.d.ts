import type { Schema, Attribute } from '@strapi/strapi';

export interface ContestContestGroup extends Schema.Component {
  collectionName: 'components_contest_contest_groups';
  info: {
    displayName: 'Contest Group';
    description: '';
  };
  attributes: {
    group: Attribute.Relation<
      'contest.contest-group',
      'oneToOne',
      'api::group.group'
    >;
    contest: Attribute.Relation<
      'contest.contest-group',
      'oneToOne',
      'api::contest.contest'
    >;
    state: Attribute.Component<'contest.state'>;
  };
}

export interface ContestState extends Schema.Component {
  collectionName: 'components_contest_states';
  info: {
    displayName: 'State';
    description: '';
  };
  attributes: {
    currentGamePack: Attribute.Integer & Attribute.DefaultTo<0>;
    currentQuestion: Attribute.Integer & Attribute.DefaultTo<0>;
    currentTimeLeft: Attribute.Integer & Attribute.DefaultTo<0>;
    currentStatus: Attribute.Enumeration<['playing', 'paused', 'ended']> &
      Attribute.DefaultTo<'paused'>;
  };
}

export interface GamePacksQuizPacks extends Schema.Component {
  collectionName: 'components_game_packs_quiz_packs';
  info: {
    displayName: 'Quiz Packs';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    questions: Attribute.Component<'quiz.quiz-questions', true>;
  };
}

export interface GamePacksWordFindPacks extends Schema.Component {
  collectionName: 'components_wordfind_word_find_packs';
  info: {
    displayName: 'Word Find Packs';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    questions: Attribute.Component<'word-find.word-find-questions', true>;
  };
}

export interface QuizQuizAnswers extends Schema.Component {
  collectionName: 'components_quiz_quiz_answers';
  info: {
    displayName: 'Quiz Answers';
    description: '';
  };
  attributes: {
    text: Attribute.String;
    media: Attribute.Media;
    isCorrected: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface QuizQuizQuestions extends Schema.Component {
  collectionName: 'components_quiz_quiz_questions';
  info: {
    displayName: 'Quiz Questions';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    illustration: Attribute.Media;
    answers: Attribute.Component<'quiz.quiz-answers', true>;
    maxScore: Attribute.Integer;
    timeLimit: Attribute.Integer & Attribute.DefaultTo<0>;
    isRelativeScore: Attribute.Boolean & Attribute.DefaultTo<true>;
    allowMultipleAnswers: Attribute.Boolean & Attribute.DefaultTo<false>;
    answerType: Attribute.Enumeration<['select', 'input']> &
      Attribute.DefaultTo<'select'>;
    col: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 1;
        max: 12;
      }> &
      Attribute.DefaultTo<6>;
  };
}

export interface WordFindWordFindAnsswers extends Schema.Component {
  collectionName: 'components_word_find_word_find_ansswers';
  info: {
    displayName: 'Word Find Answers';
    description: '';
  };
  attributes: {
    text: Attribute.String;
    isCorrected: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface WordFindWordFindQuestions extends Schema.Component {
  collectionName: 'components_word_find_word_find_questions';
  info: {
    displayName: 'Word Find Questions';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    illustration: Attribute.Media;
    answers: Attribute.Component<'word-find.word-find-ansswers', true>;
    maxScore: Attribute.Integer;
    timeLimit: Attribute.Integer;
    isRelativeScore: Attribute.Boolean & Attribute.DefaultTo<false>;
    allowMultipleAnswers: Attribute.Boolean & Attribute.DefaultTo<true>;
    puzzle: Attribute.JSON;
    puzzleDimension: Attribute.Integer & Attribute.DefaultTo<15>;
    puzzleOrientation: Attribute.String &
      Attribute.DefaultTo<'horizontal,vertical'>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'contest.contest-group': ContestContestGroup;
      'contest.state': ContestState;
      'game-packs.quiz-packs': GamePacksQuizPacks;
      'game-packs.word-find-packs': GamePacksWordFindPacks;
      'quiz.quiz-answers': QuizQuizAnswers;
      'quiz.quiz-questions': QuizQuizQuestions;
      'word-find.word-find-ansswers': WordFindWordFindAnsswers;
      'word-find.word-find-questions': WordFindWordFindQuestions;
    }
  }
}
