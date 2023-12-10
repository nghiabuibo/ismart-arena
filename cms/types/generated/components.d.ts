import type { Schema, Attribute } from '@strapi/strapi';

export interface ContestContestGroup extends Schema.Component {
  collectionName: 'components_contest_contest_groups';
  info: {
    displayName: 'Contest Group';
    description: '';
  };
  attributes: {
    contest: Attribute.Relation<
      'contest.contest-group',
      'oneToOne',
      'api::contest.contest'
    >;
    group: Attribute.Relation<
      'contest.contest-group',
      'oneToOne',
      'api::group.group'
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
      Attribute.DefaultTo<'playing'>;
  };
}

export interface QuizQuizGameAnswers extends Schema.Component {
  collectionName: 'components_quiz_game_quiz_game_answers';
  info: {
    displayName: 'Quiz Answers';
    description: '';
  };
  attributes: {
    value: Attribute.String;
  };
}

export interface QuizQuizPacks extends Schema.Component {
  collectionName: 'components_quiz_quiz_packs';
  info: {
    displayName: 'Quiz Packs';
  };
  attributes: {
    name: Attribute.String;
    questions: Attribute.Component<'quiz.quiz-questions', true>;
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
    answers: Attribute.Component<'quiz.quiz-game-answers', true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'contest.contest-group': ContestContestGroup;
      'contest.state': ContestState;
      'quiz.quiz-game-answers': QuizQuizGameAnswers;
      'quiz.quiz-packs': QuizQuizPacks;
      'quiz.quiz-questions': QuizQuizQuestions;
    }
  }
}
